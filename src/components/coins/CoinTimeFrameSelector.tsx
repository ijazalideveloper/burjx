'use client';

import { TimeFrame } from '@/lib/types';
import styles from './CoinTimeFrameSelector.module.css';

interface CoinTimeFrameSelectorProps {
  activeTimeFrame: TimeFrame;
  onChange: (timeFrame: TimeFrame) => void;
}

export default function CoinTimeFrameSelector({ activeTimeFrame, onChange }: CoinTimeFrameSelectorProps) {
  const timeFrames: TimeFrame[] = ['1H', '1D', '1W', '1M', '1Y', 'ALL'];
  
  return (
    <div className={styles.container}>
      {timeFrames.map((timeFrame) => (
        <button
          key={timeFrame}
          onClick={() => onChange(timeFrame)}
          className={`${styles.timeFrameButton} ${activeTimeFrame === timeFrame ? styles.activeButton : ''}`}
        >
          {timeFrame}
        </button>
      ))}
    </div>
  );
}