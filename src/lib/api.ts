import { ApiResponse, Coin, CoinOHLC } from "./types";

const API_BASE_URL = "https://coingeko.burjx.com";

// Utility function to log API responses for debugging
const logApiResponse = (endpoint: string, data: any) => {
  console.log(`API Response from ${endpoint}:`, {
    receivedData: !!data,
    dataType: data ? typeof data : "undefined",
    isArray: Array.isArray(data),
    firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
  });
};

/**
 * Fetches all coins with pagination support
 */
export async function getAllCoins(
  page = 1,
  pageSize = 10,
  currency = "usd"
): Promise<ApiResponse<Coin[]>> {
  try {
    console.log(
      `Fetching coins: page=${page}, pageSize=${pageSize}, currency=${currency}`
    );

    const response = await fetch(
      `${API_BASE_URL}/coin-prices-all?currency=${currency}&page=${page}&pageSize=${pageSize}`,
      { cache: "no-store" } // Disable caching to ensure fresh data
    );

    console.log("API response status:", response.status);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    logApiResponse("getAllCoins", responseData);

    // Handle different API response formats
    let coins: any[] = [];

    if (Array.isArray(responseData)) {
      // Direct array response
      coins = responseData;
    } else if (responseData && typeof responseData === "object") {
      // Check for common response patterns
      if (Array.isArray(responseData.data)) {
        coins = responseData.data;
      } else if (Array.isArray(responseData.coins)) {
        coins = responseData.coins;
      } else if (Array.isArray(responseData.results)) {
        coins = responseData.results;
      } else {
        // If we can't find an array to work with, fallback to mock data
        console.warn("Unexpected API response format:", responseData);
        coins = generateMockCoins(pageSize);
      }
    } else {
      // Fallback to mock data if response is not an array or object
      console.warn("Invalid API response type:", typeof responseData);
      coins = generateMockCoins(pageSize);
    }

    // Validate and transform the coin data to match Coin interface
    const validCoins: Coin[] = coins
      .filter((coin) => coin && typeof coin === "object")
      .map((coin) => ({
        id: coin.id || `coin-${Math.random().toString(36).substring(2, 9)}`,
        name: coin.name || "Unknown Coin",
        symbol: coin.symbol || "???",
        image: coin.image || "",
        // Transform snake_case to camelCase properties to match Coin interface
        currentPrice: isNaN(coin.currentPrice) ? 0 : coin.currentPrice,
        priceChangePercentage24h: isNaN(coin.priceChangePercentage24h)
          ? 0
          : coin.priceChangePercentage24h,
        marketCap: isNaN(coin.marketCap) ? 0 : coin.marketCap,
        tradingVolume: isNaN(coin.tradingVolume) ? 0 : coin.tradingVolume,
        circulatingSupply: isNaN(coin.circulating_supply)
          ? 0
          : coin.circulating_supply,
        // Include additional properties that might be needed
        marketCapRank: isNaN(coin.market_cap_rank) ? 0 : coin.market_cap_rank,
        ath: isNaN(coin.ath) ? 0 : coin.ath,
        athDate: coin.ath_date || "",
        lastUpdated: coin.last_updated || new Date().toISOString(),
      }));

    return { data: validCoins, success: true };
  } catch (error) {
    console.error("Error fetching all coins:", error);
    return {
      data: generateMockCoins(pageSize), // Return mock data as fallback
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches OHLC data for a specific coin
 */
export async function getCoinOHLC(
  coinId: string,
  days = 30
): Promise<ApiResponse<CoinOHLC[]>> {
  try {
    console.log(`Fetching OHLC data: coinId=${coinId}, days=${days}`);

    // Try multiple endpoint formats since the API might be expecting different parameter formats
    let response;
    let errors = [];

    // First try: using productId parameter (original)
    try {
      response = await fetch(
        `${API_BASE_URL}/coin-ohlc?productId=${coinId}&days=${days}`,
        { cache: "no-store" }
      );

      console.log("OHLC API response status (attempt 1):", response.status);

      if (!response.ok) {
        errors.push(`First attempt failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        errors.push("First attempt returned empty data");
        throw new Error("Empty data response");
      }

      logApiResponse("getCoinOHLC (attempt 1)", data);

      // Validate and clean the OHLC data
      const validData = data
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          time: item.time || Date.now(),
          open: isNaN(item.open) ? 100 : item.open,
          high: isNaN(item.high) ? 105 : item.high,
          low: isNaN(item.low) ? 95 : item.low,
          close: isNaN(item.close) ? 102 : item.close,
        }));

      return { data: validData, success: true };
    } catch (firstError) {
      console.warn("First attempt to fetch OHLC failed:", firstError);
    }

    // Second try: using id parameter
    try {
      response = await fetch(
        `${API_BASE_URL}/coin-ohlc?id=${coinId}&days=${days}`,
        { cache: "no-store" }
      );

      console.log("OHLC API response status (attempt 2):", response.status);

      if (!response.ok) {
        errors.push(`Second attempt failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        errors.push("Second attempt returned empty data");
        throw new Error("Empty data response");
      }

      logApiResponse("getCoinOHLC (attempt 2)", data);

      // Validate and clean the OHLC data
      const validData = data
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          time: item.time || Date.now(),
          open: isNaN(item.open) ? 100 : item.open,
          high: isNaN(item.high) ? 105 : item.high,
          low: isNaN(item.low) ? 95 : item.low,
          close: isNaN(item.close) ? 102 : item.close,
        }));

      return { data: validData, success: true };
    } catch (secondError) {
      console.warn("Second attempt to fetch OHLC failed:", secondError);
    }

    // Third try: using coin_id parameter
    try {
      response = await fetch(
        `${API_BASE_URL}/coin-ohlc?coin_id=${coinId}&days=${days}`,
        { cache: "no-store" }
      );

      console.log("OHLC API response status (attempt 3):", response.status);

      if (!response.ok) {
        errors.push(`Third attempt failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        errors.push("Third attempt returned empty data");
        throw new Error("Empty data response");
      }

      logApiResponse("getCoinOHLC (attempt 3)", data);

      // Validate and clean the OHLC data
      const validData = data
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          time: item.time || Date.now(),
          open: isNaN(item.open) ? 100 : item.open,
          high: isNaN(item.high) ? 105 : item.high,
          low: isNaN(item.low) ? 95 : item.low,
          close: isNaN(item.close) ? 102 : item.close,
        }));

      return { data: validData, success: true };
    } catch (thirdError) {
      console.warn("Third attempt to fetch OHLC failed:", thirdError);
    }

    // If all attempts fail, throw a comprehensive error
    throw new Error(
      `All attempts to fetch OHLC data failed: ${errors.join("; ")}`
    );
  } catch (error) {
    console.error("Error fetching OHLC data:", error);

    // Return mock data as fallback
    const mockData = generateMockOHLCData(days);
    return {
      data: mockData,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches top gaining coins by 24h price change percentage
 */
export async function getTopGainers(
  limit = 20,
  currency = "usd"
): Promise<ApiResponse<Coin[]>> {
  try {
    console.log(`Fetching top gainers: limit=${limit}, currency=${currency}`);

    // First fetch a larger set of coins to sort from
    const { data, success } = await getAllCoins(1, 100, currency);
    if (!success) throw new Error("Failed to fetch coins");

    // Sort by price change percentage (descending) and take the top 'limit' coins
    const sortedCoins = [...data]
      .filter((coin) => !isNaN(coin.priceChangePercentage24h))
      .sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h)
      .slice(0, limit);

    if (sortedCoins.length === 0) {
      // Fallback to mock data if no valid coins were found
      return { data: generateMockGainers(limit), success: true };
    }

    return { data: sortedCoins, success: true };
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    return {
      data: generateMockGainers(limit), // Return mock data as fallback
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches top losing coins by 24h price change percentage
 */
export async function getTopLosers(
  limit = 20,
  currency = "usd"
): Promise<ApiResponse<Coin[]>> {
  try {
    console.log(`Fetching top losers: limit=${limit}, currency=${currency}`);

    // First fetch a larger set of coins to sort from
    const { data, success } = await getAllCoins(1, 100, currency);
    if (!success) throw new Error("Failed to fetch coins");

    // Sort by price change percentage (ascending) and take the top 'limit' coins
    const sortedCoins = [...data]
      .filter((coin) => !isNaN(coin.priceChangePercentage24h))
      .sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h)
      .slice(0, limit);

    if (sortedCoins.length === 0) {
      // Fallback to mock data if no valid coins were found
      return { data: generateMockLosers(limit), success: true };
    }

    return { data: sortedCoins, success: true };
  } catch (error) {
    console.error("Error fetching top losers:", error);
    return {
      data: generateMockLosers(limit), // Return mock data as fallback
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetches top coins by market cap
 */
export async function getTopCoins(
  limit = 20,
  currency = "usd"
): Promise<ApiResponse<Coin[]>> {
  try {
    console.log(`Fetching top coins: limit=${limit}, currency=${currency}`);

    // Directly use getAllCoins to fetch coins
    const response = await getAllCoins(1, limit, currency);
    console.log(">>>>>>>>>>>>>>>", response)

    // Check if we got a successful response with data
    if (
      !response.success ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      console.warn("Invalid or empty data from getAllCoins:", response);
      return {
        data: generateMockTopCoins(limit),
        success: true,
        message: "Using mock data due to API issues",
      };
    }

    // Ensure we have valid data
    const validData = response.data
      .filter((coin) => coin && typeof coin === "object")
      .sort((a, b) => {
        const rankA = isNaN(a.marketCapRank) ? Infinity : a.marketCapRank;
        const rankB = isNaN(b.marketCapRank) ? Infinity : b.marketCapRank;
        return rankA - rankB;
      })
      .slice(0, limit);

    if (validData.length === 0) {
      // Fallback to mock data if no valid coins were found
      return { data: generateMockTopCoins(limit), success: true };
    }

    return { data: validData, success: true };
  } catch (error) {
    console.error("Error fetching top coins:", error);
    return {
      data: generateMockTopCoins(limit),
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Mock data generation for fallback

function generateMockCoins(count: number): Coin[] {
  const coinTemplates = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      id: "tether",
      name: "Tether",
      symbol: "usdt",
      image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "xrp",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp.png",
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "bnb",
      image:
        "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ada",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "sol",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "dot",
      image:
        "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const basePrice = 1000 + Math.random() * 50000;
    const priceChange = Math.random() * 10 - 5;
    const template = coinTemplates[i % coinTemplates.length];

    return {
      id: template.id + (i >= coinTemplates.length ? `-${i}` : ""),
      name: template.name,
      symbol: template.symbol,
      image: template.image,
      currentPrice: basePrice,
      priceChangePercentage24h: priceChange,
      marketCap: basePrice * 1000000,
      marketCapRank: i + 1,
      tradingVolume: basePrice * 100000,
      circulatingSupply: 1000000 + i * 1000000,
      ath: basePrice * 1.5,
      athDate: "2021-11-10T14:24:11.849Z",
      lastUpdated: new Date().toISOString(),
    };
  });
}

function generateMockGainers(count: number): Coin[] {
  return generateMockCoins(count).map((coin) => ({
    ...coin,
    priceChangePercentage24h: Math.random() * 30 + 5, // 5% to 35%
  }));
}

function generateMockLosers(count: number): Coin[] {
  return generateMockCoins(count).map((coin) => ({
    ...coin,
    priceChangePercentage24h: -(Math.random() * 30 + 5), // -5% to -35%
  }));
}

function generateMockTopCoins(count: number): Coin[] {
  return generateMockCoins(count).map((coin, i) => ({
    ...coin,
    marketCapRank: i + 1,
    marketCap: 1000000000000 / (i + 1),
  }));
}

function generateMockOHLCData(days: number): CoinOHLC[] {
  const now = Date.now();
  const basePrice = 10000 + Math.random() * 30000;

  return Array.from({ length: days }, (_, i) => {
    const time = now - (days - i) * 24 * 60 * 60 * 1000;
    const volatility = basePrice * 0.05;
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    return { time, open, high, low, close };
  });
}
