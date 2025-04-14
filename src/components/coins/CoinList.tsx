'use client';

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
  
  // Add each coin to the map, using ID as key
  coins.forEach((coin) => {
    if (!uniqueCoins.has(coin.id)) {
      uniqueCoins.set(coin.id, coin);
    }
  });
  
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Array.from(uniqueCoins.values()).map((coin) => (
          <div key={coin.id} className={styles.gridItem}>
            <CoinCard coin={coin} />
          </div>
        ))}
      </div>
      
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {hasMore && !loading && <div ref={observerRef} className={styles.sentinel} />}
    </div>
  );
}