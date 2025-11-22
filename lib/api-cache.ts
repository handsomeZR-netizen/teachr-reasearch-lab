/**
 * API Cache Utility
 * 
 * Provides in-memory caching for API responses to reduce redundant calls
 * Useful for caching generated topics and literature reviews
 * 
 * Performance: 16.3 - Caching API responses
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Simple in-memory cache with TTL (Time To Live)
 */
class APICache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Generate cache key from parameters
   */
  private generateKey(prefix: string, params: any): string {
    const paramsStr = JSON.stringify(params);
    return `${prefix}:${paramsStr}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(prefix: string, params: any): T | null {
    const key = this.generateKey(prefix, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    console.log('[API Cache] Cache hit:', key);
    return entry.data as T;
  }

  /**
   * Set cached data with optional custom TTL
   */
  set<T>(prefix: string, params: any, data: T, ttl?: number): void {
    const key = this.generateKey(prefix, params);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });

    console.log('[API Cache] Cached:', key, `(expires in ${(ttl || this.defaultTTL) / 1000}s)`);
  }

  /**
   * Check if cache has valid entry
   */
  has(prefix: string, params: any): boolean {
    const key = this.generateKey(prefix, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear specific cache entry
   */
  clear(prefix: string, params: any): void {
    const key = this.generateKey(prefix, params);
    this.cache.delete(key);
    console.log('[API Cache] Cleared:', key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
    console.log('[API Cache] Cleared all cache');
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      console.log(`[API Cache] Cleared ${clearedCount} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: Array<{ key: string; age: number; ttl: number }>;
  } {
    const now = Date.now();
    const entries: Array<{ key: string; age: number; ttl: number }> = [];

    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key,
        age: now - entry.timestamp,
        ttl: entry.expiresAt - now,
      });
    }

    return {
      size: this.cache.size,
      entries,
    };
  }
}

/**
 * Global API cache instance
 */
export const apiCache = new APICache();

/**
 * Cache keys for different API endpoints
 */
export const CACHE_KEYS = {
  TOPICS: 'topics',
  LITERATURE: 'literature',
  ANALYSIS: 'analysis',
  IMPROVEMENT: 'improvement',
} as const;

/**
 * Cache TTL configurations (in milliseconds)
 */
export const CACHE_TTL = {
  TOPICS: 10 * 60 * 1000,      // 10 minutes - topics don't change often
  LITERATURE: 15 * 60 * 1000,  // 15 minutes - literature reviews are stable
  ANALYSIS: 5 * 60 * 1000,     // 5 minutes - analysis might change with edits
  IMPROVEMENT: 3 * 60 * 1000,  // 3 minutes - improvement suggestions are contextual
} as const;

/**
 * Wrapper function for cached API calls
 */
export async function cachedAPICall<T>(
  cacheKey: string,
  params: any,
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = apiCache.get<T>(cacheKey, params);
  if (cached !== null) {
    return cached;
  }

  // Make API call
  const result = await apiCall();

  // Cache the result
  apiCache.set(cacheKey, params, result, ttl);

  return result;
}
