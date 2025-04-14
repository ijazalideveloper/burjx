'use client';

import { useState, useEffect, useCallback } from 'react';
import { Coin, CategoryTab, ApiResponse } from '@/lib/types';
import { getAllCoins, getTopGainers, getTopLosers, getTopCoins } from '@/lib/api';

export function useCoins(initialTab: CategoryTab = 'featured') {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<CategoryTab>(initialTab);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // Helper function to deduplicate coins by ID
  const deduplicateCoins = (coinArray: Coin[]): Coin[] => {
    console.log('Deduplicating coins:', { 
      before: coinArray.length, 
      uniqueIds: new Set(coinArray.map(c => c.id)).size 
    });
    
    const uniqueCoinsMap = new Map<string, Coin>();
    
    // Only keep the first occurrence of each coin ID
    coinArray.forEach(coin => {
      if (coin && coin.id && !uniqueCoinsMap.has(coin.id)) {
        uniqueCoinsMap.set(coin.id, coin);
      }
    });
    
    return Array.from(uniqueCoinsMap.values());
  };

  const fetchCoins = useCallback(async (reset = false) => {
    try {
      console.log(`Fetching coins for tab: ${activeTab}, reset: ${reset}, page: ${page}`);
      setLoading(true);
      setError(null);
      
      let result: ApiResponse<Coin[]>;
      const newPage = reset ? 1 : page;
      const pageSize = 20;
      
      // Try to fetch data for the selected tab
      console.log(`Trying to fetch data for tab: ${activeTab}`);
      try {
        switch (activeTab) {
          case 'featured':
            result = await getTopCoins(pageSize);
            break;
          case 'gainers':
            result = await getTopGainers(pageSize);
            break;
          case 'losers':
            result = await getTopLosers(pageSize);
            break;
          default:
            console.log('Using default getAllCoins fallback');
            result = await getAllCoins(newPage, pageSize);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} coins:`, err);
        // Fallback to getAllCoins if specific endpoint fails
        console.log('Falling back to getAllCoins due to error');
        result = await getAllCoins(newPage, pageSize);
      }

      // Validate result structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid API response format');
      }

      // Check for API success
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch coins');
      }

      // Ensure we have an array of coins
      if (!Array.isArray(result.data)) {
        console.warn('API returned non-array data:', result.data);
        result.data = [];
      }

      console.log(`Received ${result.data.length} coins from API`);
      
      // Deduplicate the coin data
      const uniqueData = deduplicateCoins(result.data);
      console.log(`After deduplication: ${uniqueData.length} coins`);

      // Update state based on reset flag
      if (reset) {
        console.log('Resetting coins state with new data');
        setCoins(uniqueData);
      } else {
        console.log('Appending to existing coins state');
        // Deduplicate combined with existing coins
        const combinedCoins = [...coins, ...uniqueData];
        setCoins(deduplicateCoins(combinedCoins));
      }
      
      // Determine if there might be more data to load
      setHasMore(result.data.length > 0);
      
      // Only increment page for pagination if not resetting
      if (!reset) {
        setPage(prev => prev + 1);
      }
      
      // First load complete
      if (initialLoad) {
        setInitialLoad(false);
      }
    } catch (err) {
      console.error('Error in fetchCoins:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Set empty array on error to avoid showing stale data
      if (reset) {
        setCoins([]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, coins, initialLoad]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      console.log('Loading more coins...');
      fetchCoins();
    }
  }, [fetchCoins, loading, hasMore]);

  const changeTab = useCallback((tab: CategoryTab) => {
    if (tab === activeTab) return;
    console.log(`Changing tab from ${activeTab} to ${tab}`);
    setActiveTab(tab);
    setPage(1);
    setCoins([]);
    fetchCoins(true);
  }, [activeTab, fetchCoins]);

  // Initial fetch on component mount
  useEffect(() => {
    console.log('Initial useEffect running to fetch coins');
    fetchCoins(true);
    
    // Cleanup function
    return () => {
      console.log('useCoins cleanup');
    };
  }, []);

  return {
    coins,
    loading,
    error,
    hasMore,
    activeTab,
    loadMore,
    changeTab
  };
}