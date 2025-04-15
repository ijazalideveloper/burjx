"use client";

import { useRef, useEffect } from 'react';
import { Coin } from '@/lib/types';
import CoinCard from './CoinCard';
import styles from './CoinList.module.css';

interface CoinListProps {
  coins: Coin[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function CoinList({ coins, loading, hasMore, onLoadMore }: CoinListProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);
  
  // Create a Map to deduplicate coins
  const uniqueCoins = new Map<string, Coin>();
  
  // Deduplicate coins by ID
  coins.forEach((coin) => {
    if (!uniqueCoins.has(coin.id)) {
      uniqueCoins.set(coin.id, coin);
    }
  });
  
  // Convert map back to array
  const deduplicatedCoins = Array.from(uniqueCoins.values());
  
  if (deduplicatedCoins.length === 0 && !loading) {
    return (
      <div className={styles.noData}>No cryptocurrencies available</div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {deduplicatedCoins.map((coin) => (
          <div key={coin.id} className={styles.gridItem}>
            <CoinCard coin={coin} />
          </div>
        ))}
        
        {/* Loading indicator cards */}
        {loading && (
          <>
            <div className={styles.gridItem}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonText}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonSubtitle}></div>
                  </div>
                </div>
                <div className={styles.skeletonChart}></div>
                <div className={styles.skeletonFooter}>
                  <div className={styles.skeletonPrice}></div>
                  <div className={styles.skeletonChange}></div>
                </div>
              </div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                  <div className={styles.skeletonImage}></div>
                  <div className={styles.skeletonText}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonSubtitle}></div>
                  </div>
                </div>
                <div className={styles.skeletonChart}></div>
                <div className={styles.skeletonFooter}>
                  <div className={styles.skeletonPrice}></div>
                  <div className={styles.skeletonChange}></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={observerRef} className={styles.sentinel} />}
    </div>
  );
}