'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coin } from '@/lib/types';
import styles from './CoinCard.module.css';
import SimpleGraph from './SimpleGraph';

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Better handling of price data
  const price = typeof coin.current_price === 'number' ? coin.current_price : null;
  const priceChange = typeof coin.price_change_percentage_24h === 'number' 
    ? coin.price_change_percentage_24h 
    : null;
  
  const priceChangeIsPositive = priceChange !== null ? priceChange >= 0 : true;
  
  // Format price with proper fallback
  const formattedPrice = price !== null
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      }).format(price)
    : 'N/A';
  
  // Format percentage with proper fallback
  const percentageChangeFormatted = priceChange !== null
    ? `${priceChange >= 0 ? '+' : ''}${Math.abs(priceChange).toFixed(2)}%`
    : '0.00%';
  
  // Create a coin initials display as fallback
  const coinInitial = coin?.symbol ? coin.symbol.slice(0, 1).toUpperCase() : '?';
  
  return (
    <Link href={`/coin/${coin.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.header}>
            <div className={styles.imageContainer}>
              {coin.image && !imageError ? (
                <img
                  src={coin.image}
                  alt={coin.name || 'Cryptocurrency'}
                  className={styles.coinImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.imageFallback}>
                  {coinInitial}
                </div>
              )}
            </div>
            <div className={styles.coinInfo}>
              <h3 className={styles.symbol}>{(coin.symbol || '???').toUpperCase()}</h3>
              <p className={styles.name}>{coin.name || 'Unknown'}</p>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <SimpleGraph trend={priceChangeIsPositive ? 'up' : 'down'} height={60} />
          </div>
          
          <div className={styles.footer}>
            <div className={styles.price}>{formattedPrice}</div>
            <div className={`${styles.change} ${priceChangeIsPositive ? styles.positiveChange : styles.negativeChange}`}>
              {percentageChangeFormatted}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}