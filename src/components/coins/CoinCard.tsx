"use client";

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
  
  // Handle potential missing or invalid data with safe defaults
  const price = typeof coin.current_price === 'number' && !isNaN(coin.current_price) 
    ? coin.current_price 
    : null;
  
  const priceChange = typeof coin.price_change_percentage_24h === 'number' && !isNaN(coin.price_change_percentage_24h)
    ? coin.price_change_percentage_24h
    : null;
  
  // Determine if price change is positive
  const priceChangeIsPositive = priceChange !== null ? priceChange >= 0 : true;
  
  // Format price with proper fallback and handling
  const formattedPrice = price !== null
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2, // Use more decimals for small amounts
      }).format(price)
    : '$0.00';
  
  // Format percentage with proper sign and fallback
  const percentageChangeFormatted = priceChange !== null
    ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`
    : '+0.00%';
  
  // Initials for fallback image
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