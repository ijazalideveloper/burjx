'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChartType, Coin, TimeFrame } from '@/lib/types';
import { getAllCoins, getCoinOHLC } from '@/lib/api';
import CoinSidebar from '@/components/coins/CoinSidebar';
import CoinTimeFrameSelector from '@/components/coins/CoinTimeFrameSelector';
import ChartTypeSelector from '@/components/coins/ChartTypeSelector';
import PriceLineChart from '@/components/charts/LineChart';
import CandlestickChart from '@/components/charts/CandlestickChart';
import CoinInfoCard from '@/components/coins/CoinInfoCard';
import styles from './CoinDetails.module.css';

export default function CoinDetailsPage() {
  const { id } = useParams();
  const coinId = id as string;
  
  const [coin, setCoin] = useState<Coin | null>(null);
  const [relatedCoins, setRelatedCoins] = useState<Coin[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1H');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map timeframe to days for API
  const timeFrameToDays: Record<TimeFrame, number | string> = {
    '1H': 1,
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '1Y': 365,
    'ALL': 'max'
  };

  // Fetch coin and chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all coins first to get the current coin and related coins
        console.log("Fetching all coins...");
        const { data: allCoins, success } = await getAllCoins(1, 50);
        if (!success) {
          throw new Error('Failed to fetch coins data');
        }
        
        // Find the requested coin
        console.log(`Looking for coin with ID: ${coinId}`);
        const currentCoin = allCoins.find(c => c.id === coinId);
        if (!currentCoin) {
          console.error(`Coin with ID ${coinId} not found in the data:`, allCoins);
          throw new Error(`Coin with ID ${coinId} not found`);
        }
        
        console.log("Found coin:", currentCoin);
        setCoin(currentCoin);
        
        // Get related coins (e.g., top 10 by market cap)
        const topCoins = [...allCoins]
          .sort((a, b) => (a.marketCapRank || Infinity) - (b.marketCapRank || Infinity))
          .slice(0, 10);
        setRelatedCoins(topCoins);
        
        // Some APIs require numeric IDs instead of string identifiers
        // Try to find the numeric ID from the coin object
        const numericId = currentCoin.marketCapRank || 1;
        
        // Fetch OHLC data for the chart, try different ID formats
        console.log(`Fetching chart data with ID: ${coinId}, numericId: ${numericId}, days: ${timeFrameToDays[timeFrame]}`);
        try {
          // First try with string ID
          const { data: ohlcData, success: ohlcSuccess } = await getCoinOHLC(coinId, timeFrameToDays[timeFrame] as number);
          console.log("ohlcDataohlcData", ohlcData)
          if (!ohlcSuccess || !ohlcData || ohlcData.length === 0) {
            throw new Error('First attempt failed');
          }
          setChartData(ohlcData);
        } catch (ohlcError) {
          console.log("First attempt to fetch OHLC failed, trying with numeric ID...");
          try {
            // Try with numeric ID
            const { data: ohlcData2, success: ohlcSuccess2 } = await getCoinOHLC(String(numericId), timeFrameToDays[timeFrame] as number);
            if (!ohlcSuccess2 || !ohlcData2 || ohlcData2.length === 0) {
              throw new Error('Second attempt failed');
            }
            setChartData(ohlcData2);
          } catch (secondError) {
            console.log("All attempts failed, using mock data");
            // Generate mock chart data as fallback
            setChartData(generateMockChartData(timeFrameToDays[timeFrame] as number, priceChangeIsPositive));
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // Generate mock chart data as fallback
        const mockPriceChange = coin?.priceChangePercentage24h || 0;
        setChartData(generateMockChartData(timeFrameToDays[timeFrame] as number, mockPriceChange >= 0));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [coinId, timeFrame]);

  // Handle timeframe change
  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Handle chart type change
  const handleChartTypeChange = (newChartType: ChartType) => {
    setChartType(newChartType);
  };

  // Calculate price change
  const priceChangeIsPositive: boolean = coin?.priceChangePercentage24h !== undefined 
  ? coin.priceChangePercentage24h >= 0 
  : true; // Default to positive if no data

  // Generate mock chart data for fallback
  function generateMockChartData(days: number | string, isPositive: boolean = true) {
    const numDays = typeof days === 'string' ? 180 : Number(days);
    const points = numDays * 24; // hourly data points
    const now = Date.now();
    const basePrice = coin?.currentPrice || 10000;
    const volatility = basePrice * 0.05;
    
    return Array.from({ length: points }, (_, i) => {
      const time = now - (points - i) * 3600 * 1000; // hourly intervals
      const randomFactor = isPositive 
        ? 1 + (Math.random() * 0.02 * (i / points)) 
        : 1 - (Math.random() * 0.02 * (i / points));
      
      const open = basePrice * randomFactor;
      const close = open * (0.998 + Math.random() * 0.004); // +/- 0.2%
      const high = Math.max(open, close) * (1 + Math.random() * 0.003);
      const low = Math.min(open, close) * (1 - Math.random() * 0.003);
      
      return { time, open, high, low, close };
    });
  }

  return (
    <div className={styles.container}>
      {/* Mobile Coin Selector */}
      <div className={styles.mobileSelector}>
        {!loading && coin && (
          <div className={styles.mobileCoinInfo}>
            <div className={styles.coinImageContainer}>
              {coin.image && (
                <img 
                  src={coin.image} 
                  alt={coin.name}
                  className={styles.coinImage}
                />
              )}
            </div>
            <div>
              <h1 className={styles.coinName}>{coin.name}</h1>
              <p className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
        )}
        <select 
          className={styles.coinSelect}
          value={coinId}
          onChange={(e) => window.location.href = `/coin/${e.target.value}`}
        >
          {relatedCoins.map((relatedCoin) => (
            <option key={relatedCoin.id} value={relatedCoin.id}>
              {relatedCoin.name} ({relatedCoin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        {/* Sidebar for Desktop */}
        <div className={styles.sidebar}>
          <CoinSidebar 
            coins={relatedCoins} 
            activeCoinId={coinId} 
            loading={loading} 
          />
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Loading coin data...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button className={styles.retryButton} onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : coin ? (
            <>
              {/* Coin Header */}
              <div className={styles.coinHeader}>
                <div className={styles.coinBasicInfo}>
                  {coin.image && (
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className={styles.coinHeaderImage}
                    />
                  )}
                  <div>
                    <h1 className={styles.coinHeaderName}>{coin.name}</h1>
                    <p className={styles.coinHeaderSymbol}>{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>

                <div className={styles.coinPriceInfo}>
                  <div>
                    <p className={styles.coinPrice}>
                      ${coin.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </p>
                    <div className={`${styles.priceChange} ${priceChangeIsPositive ? styles.positive : styles.negative}`}>
                      <span className={styles.changeIcon}>
                        {priceChangeIsPositive ? '↑' : '↓'}
                      </span>
                      <span>
                        {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
                      </span>
                      <span className={styles.timeFrame}>24h</span>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={styles.buyButton}>
                      Buy
                    </button>
                    <button className={styles.sellButton}>
                      Sell
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Controls */}
              <div className={styles.chartContainer}>
                <div className={styles.chartControls}>
                  <CoinTimeFrameSelector
                    activeTimeFrame={timeFrame}
                    onChange={handleTimeFrameChange}
                  />
                  <ChartTypeSelector
                    activeChartType={chartType}
                    onChange={handleChartTypeChange}
                  />
                </div>

                {/* Chart */}
                <div className={styles.chart}>
                  {chartData.length > 0 ? (
                    chartType === 'line' ? (
                      <PriceLineChart data={chartData} isPositive={priceChangeIsPositive || false} />
                    ) : (
                      <CandlestickChart data={chartData} isPositive={priceChangeIsPositive || false} />
                    )
                  ) : (
                    <div className={styles.noDataMessage}>
                      <p>No chart data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Coin Info */}
              <div className={styles.coinInfoGrid}>
                <CoinInfoCard
                  title="Market Cap"
                  value={`$${coin.marketCap?.toLocaleString() || 'N/A'}`}
                  change={coin?.priceChangePercentage24h}
                />
                <CoinInfoCard
                  title="Volume (24h)"
                  value={`$${coin.tradingVolume?.toLocaleString() || 'N/A'}`}
                />
                <CoinInfoCard
                  title="Circulating Supply"
                  value={`${coin.circulatingSupply?.toLocaleString() || 'N/A'} ${coin.symbol?.toUpperCase()}`}
                  // secondaryValue={coin.max_supply ? `Max: ${coin.max_supply.toLocaleString()}` : undefined}
                />
              </div>
            </>
          ) : (
            <div className={styles.notFoundContainer}>
              <p>Coin not found</p>
              <a href="/markets" className={styles.backButton}>Back to Markets</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}