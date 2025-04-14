'use client';

import { Coin } from '@/lib/types';
import Link from 'next/link';
import styles from './CoinSidebar.module.css';

interface CoinSidebarProps {
  coins: Coin[];
  activeCoinId: string;
  loading: boolean;
}

export default function CoinSidebar({ coins, activeCoinId, loading }: CoinSidebarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Coins</h2>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div className={styles.coinList}>
          {coins.map((coin) => {
            const isActive = coin.id === activeCoinId;
            const priceChangeIsPositive = coin.price_change_percentage_24h >= 0;
            
            return (
              <Link 
                key={coin.id} 
                href={`/coin/${coin.id}`}
                className={`${styles.coinItem} ${isActive ? styles.activeCoin : ''}`}
              >
                <div className={styles.coinInfo}>
                  <div className={styles.coinImageWrapper}>
                    {coin.image ? (
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className={styles.coinImage}
                      />
                    ) : (
                      <div className={styles.coinImagePlaceholder}>
                        {coin.symbol.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.coinDetails}>
                    <div className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</div>
                    <div className={styles.coinName}>{coin.name}</div>
                  </div>
                </div>
                <div className={styles.coinPriceInfo}>
                  <div className={styles.coinPrice}>
                    ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || 'N/A'}
                  </div>
                  <div className={`${styles.priceChange} ${priceChangeIsPositive ? styles.positive : styles.negative}`}>
                    {priceChangeIsPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}