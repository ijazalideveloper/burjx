'use client';

import { useState, useEffect } from 'react';
import { CoinOHLC, TimeFrame, ChartType } from '../lib/types';
import { getCoinOHLC } from '../lib/api';

const timeFrameToDays: Record<TimeFrame, number> = {
  '1H': 1,
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '1Y': 365,
  'ALL': 'max' as unknown as number
};

export function useCoinDetails(coinId: string, initialTimeFrame: TimeFrame = '1H') {
  const [ohlcData, setOhlcData] = useState<CoinOHLC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(initialTimeFrame);
  const [chartType, setChartType] = useState<ChartType>('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const days = timeFrameToDays[timeFrame];
        const result = await getCoinOHLC(coinId, days);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch OHLC data');
        }
        
        setOhlcData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [coinId, timeFrame]);

  const changeTimeFrame = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  const toggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'candlestick' : 'line');
  };

  return {
    ohlcData,
    loading,
    error,
    timeFrame,
    chartType,
    changeTimeFrame,
    toggleChartType
  };
}