'use client';

import React from 'react';
import styles from './SimpleGraph.module.css';

interface SimpleGraphProps {
  trend: 'up' | 'down';
  height?: number;
}

export default function SimpleGraph({ trend, height = 60 }: SimpleGraphProps) {
  const trendColor = trend === 'up' ? '#10b981' : '#ef4444';
  
  return (
    <div 
      className={`${styles.container} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}
      style={{ height: `${height}px` }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 30" 
        preserveAspectRatio="none"
        className={styles.svg}
      >
        {trend === 'up' ? (
          <path 
            d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,0" 
            stroke={trendColor} 
            fill="none" 
            strokeWidth="1.5"
          />
        ) : (
          <path 
            d="M0,0 L10,5 L20,3 L30,10 L40,8 L50,15 L60,12 L70,20 L80,18 L90,25 L100,30" 
            stroke={trendColor} 
            fill="none" 
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
}