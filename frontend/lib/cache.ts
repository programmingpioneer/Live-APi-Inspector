/**
 * Tiny in-memory cache with TTL.
 * Used by useCachedRequests — SWR-style stale-while-revalidate.
 *
 * Scoped to browser session — refreshed on full page load.
 * Not localStorage (we want fresh data on reload, only instant on client nav).
 */

interface Entry<T> {
  data: T;
  timestamp: number;
}

const TTL_MS = 30_000; // 30 seconds
const store = new Map<string, Entry<unknown>>();

export interface CacheHit<T> {
  data: T;
  /** true = within TTL, false = stale (should revalidate) */
  fresh: boolean;
}

export function cacheGet<T>(key: string): CacheHit<T> | null {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry) return null;
  return {
    data: entry.data,
    fresh: Date.now() - entry.timestamp < TTL_MS,
  };
}

export function cacheSet<T>(key: string, data: T): void {
  store.set(key, { data, timestamp: Date.now() });
}

export function cacheDelete(key: string): void {
  store.delete(key);
}

export function cacheClearPrefix(prefix: string): void {
  for (const k of Array.from(store.keys())) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}