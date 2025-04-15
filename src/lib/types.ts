/**
 * Common API response wrapper to ensure consistent error handling
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Represents a cryptocurrency with its market data
 */
export interface Coin {
  max_supply?: any;
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number; // camelCase version of current_price
  priceChangePercentage24h: number; // camelCase version of price_change_percentage_24h
  marketCap: number; // camelCase version of market_cap
  tradingVolume: number; // corresponds to total_volume
  circulatingSupply: number; // camelCase version of circulating_supply
  marketCapRank: number; // Method that returns market cap rank (not a property)
  ath?: number; // All-time high price
  athDate?: string; // Date of all-time high
  lastUpdated?: string; // ISO date string of last update
}

export interface CoinOHLC {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type ChartType = "line" | "candlestick";
export type TimeFrame = "1H" | "1D" | "1W" | "1M" | "1Y" | "ALL";
export type CategoryTab = "featured" | "gainers" | "losers";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
