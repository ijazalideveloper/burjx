"use client";

import React from 'react';
import styles from './SimpleGraph.module.css';

interface SimpleGraphProps {
  trend: 'up' | 'down';
  height?: number;
}

export default function SimpleGraph({ trend, height = 60 }: SimpleGraphProps) {
  return (
    <div 
      className={`${styles.container} ${trend === 'up' ? styles.up : styles.down}`}
      style={{ height: `${height}px` }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 30" 
        preserveAspectRatio="none"
        className={styles.chart}
      >
        {trend === 'up' ? (
          <path 
            d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,15 L60,16 L70,10 L80,12 L90,5 L100,3" 
            stroke="currentColor" 
            fill="none"
            strokeWidth="1.5"
          />
        ) : (
          <path 
            d="M0,5 L10,8 L20,6 L30,12 L40,10 L50,15 L60,14 L70,20 L80,18 L90,25 L100,27" 
            stroke="currentColor" 
            fill="none"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
}