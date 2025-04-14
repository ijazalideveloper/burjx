/**
 * Formats a number as currency with appropriate decimal places
 */
export function formatCurrency(
  value: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a large number with appropriate suffix (K, M, B, T)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toString();
}

/**
 * Formats a percentage with a + or - sign
 */
export function formatPercentage(value: number, fractionDigits = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

/**
 * Determines the right number of decimal places for price display
 * based on the price magnitude
 */
export function getPriceDecimalPlaces(price: number): {
  min: number;
  max: number;
} {
  if (price >= 1000) {
    return { min: 2, max: 2 };
  } else if (price >= 1) {
    return { min: 2, max: 4 };
  } else if (price >= 0.01) {
    return { min: 4, max: 6 };
  } else {
    return { min: 6, max: 8 };
  }
}

/**
 * Smartly formats a price based on its magnitude
 */
export function formatPrice(price: number): string {
  const { min, max } = getPriceDecimalPlaces(price);
  return formatCurrency(price, min, max);
}

/**
 * Truncates text with ellipsis if it exceeds the maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Generates a random color
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Debounces a function
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculate percent change between two values
 */
export function calculatePercentChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
