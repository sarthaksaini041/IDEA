// Tiny per-instance rate limiter for cheap public GET endpoints, where writing every hit to
// Postgres would cost more than the request. It is not global across instances; the
// Postgres-backed limiter in lib/auth/rate.ts is used for anything security-sensitive.
const buckets = new Map<string, { count: number; reset: number }>();

export function memLimited(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
    return false;
  }
  b.count++;
  return b.count > max;
}
