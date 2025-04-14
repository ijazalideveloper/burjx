'use client';

import styles from './CoinInfoCard.module.css';

interface CoinInfoCardProps {
  title: string;
  value: string;
  secondaryValue?: string;
  change?: number;
}

export default function CoinInfoCard({ title, value, secondaryValue, change }: CoinInfoCardProps) {
  const hasChange = change !== undefined;
  const isPositive = hasChange && change >= 0;
  
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.valueContainer}>
        <p className={styles.value}>{value}</p>
        {hasChange && (
          <p className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </p>
        )}
      </div>
      {secondaryValue && (
        <p className={styles.secondaryValue}>{secondaryValue}</p>
      )}
    </div>
  );
}