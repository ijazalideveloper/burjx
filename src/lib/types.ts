export interface Coin {
    currentPrice: number;
    priceChangePercentage24h: number;
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    last_updated: string;
    sparkline_in_7d?: { price: number[] }; // Make this optional
  }
  
  export interface CoinOHLC {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }
  
  export type ChartType = 'line' | 'candlestick';
  export type TimeFrame = '1H' | '1D' | '1W' | '1M' | '1Y' | 'ALL';
  export type CategoryTab = 'featured' | 'gainers' | 'losers';
  
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }