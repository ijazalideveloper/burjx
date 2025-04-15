'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coin } from '@/lib/types';
import styles from './CoinMarketTable.module.css';
import SimpleGraph from './SimpleGraph';

interface CoinMarketTableProps {
  coins: Coin[];
  loading: boolean;
}

type SortKey = keyof Coin | null;
type SortDirection = 'asc' | 'desc';

export default function CoinMarketTable({ coins, loading }: CoinMarketTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const handleSort = (key: keyof Coin) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getSortedCoins = () => {
    if (!sortKey) return coins;
    
    return [...coins].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      // Handle undefined or null values
      if (aValue === undefined || aValue === null) return sortDir === 'asc' ? 1 : -1;
      if (bValue === undefined || bValue === null) return sortDir === 'asc' ? -1 : 1;
      
      // Compare values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Convert to strings for string comparison
      const aString = String(aValue);
      const bString = String(bValue);
      
      return sortDir === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  };

  const sortedCoins = getSortedCoins();

  const renderSortIcon = (key: keyof Coin) => {
    if (sortKey !== key) return <span className={styles.neutralSort}>⇅</span>;
    return sortDir === 'asc' ? <span className={styles.ascSort}>↑</span> : <span className={styles.descSort}>↓</span>;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th
              className={styles.tableHeader}
              onClick={() => handleSort('market_cap_rank')}
            >
              <div className={styles.headerContent}>
                <span>Market Name</span>
                {renderSortIcon('market_cap_rank')}
              </div>
            </th>
            <th
              className={styles.tableHeader}
              onClick={() => handleSort('market_cap')}
            >
              <div className={styles.headerContent}>
                <span>Market Cap</span>
                {renderSortIcon('market_cap')}
              </div>
            </th>
            <th
              className={styles.tableHeader}
              onClick={() => handleSort('total_volume')}
            >
              <div className={styles.headerContent}>
                <span>Trading Volume</span>
                {renderSortIcon('total_volume')}
              </div>
            </th>
            <th className={styles.tableHeader}>24h Chart</th>
            <th
              className={styles.tableHeader}
              onClick={() => handleSort('currentPrice')}
            >
              <div className={styles.headerContent}>
                <span>Price</span>
                {renderSortIcon('currentPrice')}
              </div>
            </th>
            <th
              className={styles.tableHeader}
              onClick={() => handleSort('price_change_percentage_24h')}
            >
              <div className={styles.headerContent}>
                <span>24h Change</span>
                {renderSortIcon('price_change_percentage_24h')}
              </div>
            </th>
            <th className={`${styles.tableHeader} ${styles.centerCell}`}>Trade</th>
          </tr>
        </thead>
        <tbody>
          {loading && coins.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.loadingCell}>
                <div className={styles.spinnerContainer}>
                  <div className={styles.spinner}></div>
                </div>
              </td>
            </tr>
          ) : (
            sortedCoins.map((coin) => {
              const priceChangeIsPositive = coin.priceChangePercentage24h >= 0;
              
              return (
                <tr key={coin.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.coinCell}>
                      <div className={styles.coinImageWrapper}>
                        {coin.image ? (
                          <img 
                            src={coin.image} 
                            alt={coin.name}
                            className={styles.coinImage}
                          />
                        ) : (
                          <div className={styles.coinImageFallback}>
                            {coin.symbol.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={styles.coinInfo}>
                        <div className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</div>
                        <div className={styles.coinName}>{coin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    ${coin.marketCap?.toLocaleString() || 'N/A'}
                  </td>
                  <td className={styles.tableCell}>
                    ${coin.tradingVolume?.toLocaleString() || 'N/A'}
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.miniChart}>
                      <div 
                        className={`${styles.chartPlaceholder} ${priceChangeIsPositive ? styles.positiveChart : styles.negativeChart}`}
                      ><SimpleGraph trend={priceChangeIsPositive ? 'up' : 'down'} height={60} /></div>
                    </div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.priceCell}`}>
                    ${coin.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || 'N/A'}
                  </td>
                  <td className={`${styles.tableCell} ${priceChangeIsPositive ? styles.positiveChange : styles.negativeChange}`}>
                    {priceChangeIsPositive ? '+' : ''}
                    {coin.priceChangePercentage24h?.toFixed(2)}%
                  </td>
                  <td className={`${styles.tableCell} ${styles.centerCell}`}>
                    <Link 
                      href={`/coin/${coin.id}`}
                      className={styles.tradeButton}
                    >
                      Trade
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}