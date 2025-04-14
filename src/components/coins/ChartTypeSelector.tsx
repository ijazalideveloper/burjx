'use client';

import { ChartType } from '@/lib/types';
import styles from './ChartTypeSelector.module.css';

interface ChartTypeSelectorProps {
  activeChartType: ChartType;
  onChange: (chartType: ChartType) => void;
}

export default function ChartTypeSelector({ activeChartType, onChange }: ChartTypeSelectorProps) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => onChange('line')}
        className={`${styles.typeButton} ${activeChartType === 'line' ? styles.activeButton : ''}`}
        title="Line Chart"
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H5V21H3V12Z" fill="currentColor" />
          <path d="M19 8H21V21H19V8Z" fill="currentColor" />
          <path d="M11 2H13V21H11V2Z" fill="currentColor" />
          <path d="M3 16L8 11L13 16L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.buttonText}>Line</span>
      </button>
      <button
        onClick={() => onChange('candlestick')}
        className={`${styles.typeButton} ${activeChartType === 'candlestick' ? styles.activeButton : ''}`}
        title="Candlestick Chart"
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="8" width="4" height="8" fill="currentColor" />
          <rect x="15" y="8" width="4" height="8" fill="currentColor" />
        </svg>
        <span className={styles.buttonText}>Candlestick</span>
      </button>
    </div>
  );
}