/** Median of a non-empty list. */
export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Drop listings that are almost certainly not a complete working unit: below 35% of the
 * median usually means parts, a barebone without CPU/RAM or a misfiled accessory.
 */
export function withoutOutliers(prices: number[]): number[] {
  if (prices.length < 4) return prices;
  const m = median(prices);
  return prices.filter((p) => p >= m * 0.35);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
