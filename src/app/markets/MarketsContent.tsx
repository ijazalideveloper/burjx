"use client";

import { useState, useEffect } from "react";
import { CategoryTab } from "@/lib/types";
import MarketTabs from "@/components/coins/MarketTabs";
import CoinSlider from "@/components/coins/CoinSlider";
import CoinList from "@/components/coins/CoinList";
import CoinMarketTable from "@/components/coins/CoinMarketTable";
import { useCoins } from "@/hooks/useCoins";
import styles from "./Markets.module.css";

export default function MarketsContent() {
  const [viewMode, setViewMode] = useState<'cards' | 'grid' | 'table'>('cards');
  
  const {
    coins,
    loading,
    error,
    hasMore,
    activeTab,
    loadMore,
    changeTab
  } = useCoins('featured');

  // Log data for debugging
  useEffect(() => {
    if (coins.length > 0) {
      console.log("Sample coin data:", {
        firstCoin: coins[0],
        price: coins[0].current_price,
        priceChange: coins[0].price_change_percentage_24h
      });
    }
  }, [coins]);

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
              aria-label="Slider view"
              title="Slider View"
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
              aria-label="Grid view"
              title="Grid View"
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V3" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 21V3" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 15H21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`${styles.toggleButton} ${viewMode === 'table' ? styles.activeToggle : ''}`}
              aria-label="Table view"
              title="Table View"
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 15H21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Retry
            </button>
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
        {!loading && coins.length === 0 && !error && (
          <div className={styles.noDataContainer}>
            <p>No cryptocurrency data available at the moment.</p>
          </div>
        )}
        
        {/* Cards View with Slider */}
        {coins.length > 0 && viewMode === 'cards' && (
          <div className={styles.viewSection}>
            <CoinSlider coins={coins} loading={loading} />
          </div>
        )}

        {/* Grid View */}
        {coins.length > 0 && viewMode === 'grid' && (
          <div className={styles.viewSection}>
            <CoinList coins={coins} loading={loading} hasMore={hasMore} onLoadMore={loadMore} />
          </div>
        )}
        
        {/* Table View */}
        {coins.length > 0 && viewMode === 'table' && (
          <div className={styles.viewSection}>
            <CoinMarketTable coins={coins} loading={loading} />
          </div>
        )}
        
        {/* Load More Button (only for grid and table views) */}
        {hasMore && !loading && (viewMode === 'grid' || viewMode === 'table') && (
          <div className={styles.loadMoreContainer}>
            <button 
              onClick={loadMore}
              className={styles.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}