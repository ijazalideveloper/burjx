'use client';

import { useState } from 'react';
import { CategoryTab } from '@/lib/types';
import MarketTabs from '@/components/coins/MarketTabs';
import CoinSlider from '@/components/coins/CoinSlider';
import CoinMarketTable from '@/components/coins/CoinMarketTable';
import { useCoins } from '@/hooks/useCoins';
import styles from './Markets.module.css';

export default function MarketsContent() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const {
    coins,
    loading,
    error,
    hasMore,
    activeTab,
    loadMore,
    changeTab
  } = useCoins('featured');

  console.log("Current coins data:", {
    coinsLength: coins.length,
    firstCoin: coins[0],
    loading,
    error,
    hasMore,
    activeTab
  });

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Markets</h1>
      
      <div className={styles.contentContainer}>
        <div className={styles.headerSection}>
          <MarketTabs activeTab={activeTab} onTabChange={changeTab} />
          
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('cards')}
              className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.activeToggle : ''}`}
              aria-label="Card view"
            >
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`${styles.toggleButton} ${viewMode === 'table' ? styles.activeToggle : ''}`}
              aria-label="Table view"
            >
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            Error: {error}
          </div>
        )}
        
        {/* Loading state */}
        {loading && coins.length === 0 && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading cryptocurrency data...</p>
          </div>
        )}
        
        {/* No data state */}
        {!loading && coins.length === 0 && (
          <div className={styles.noDataContainer}>
            <p>No cryptocurrency data available at the moment.</p>
          </div>
        )}
        
        {/* Cards View with Slider */}
        {coins.length > 0 && viewMode === 'cards' && (
          <div className={styles.cardsSection}>
            <CoinSlider coins={coins} loading={loading} />
          </div>
        )}
        
        {/* Table View */}
        {coins.length > 0 && viewMode === 'table' && (
          <div className={styles.tableSection}>
            <CoinMarketTable coins={coins} loading={loading} />
          </div>
        )}
        
        {/* Load More Button (only for table view) */}
        {hasMore && !loading && viewMode === 'table' && coins.length > 0 && (
          <div className={styles.loadMoreContainer}>
            <button 
              onClick={loadMore}
              className={styles.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}

        {/* Infinite scroll sentinel for card view */}
        {hasMore && viewMode === 'cards' && !loading && coins.length > 0 && (
          <div 
            className={styles.loadMoreSentinel}
            ref={(el) => {
              if (!el) return;
              
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting) {
                    loadMore();
                  }
                },
                { threshold: 0.5 }
              );
              
              observer.observe(el);
              
              return () => {
                observer.disconnect();
              };
            }}
          />
        )}
      </div>
    </div>
  );
}