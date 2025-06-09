import { TIMING, LIMITS } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
  tags?: string[];
}

// Cache options
interface CacheOptions {
  ttl?: number;
  tags?: string[];
  serialize?: boolean;
  compress?: boolean;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    hitRate: 0
  };
  private maxSize: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this.startCleanupInterval();
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size--;
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    
    logger.debug(`Cache hit for key: ${key}`);
    return entry.data;
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = TIMING.CACHE_MEDIUM,
      tags = [],
      serialize = false,
      compress = false
    } = options;

    // Serialize data if requested
    let processedData = data;
    if (serialize && typeof data === 'object') {
      try {
        processedData = JSON.parse(JSON.stringify(data)) as T;
      } catch (error) {
        logger.error('Failed to serialize cache data', error as Error, { metadata: { key } });
        return;
      }
    }

    // Create cache entry
    const entry: CacheEntry<T> = {
      data: processedData,
      timestamp: Date.now(),
      ttl,
      key,
      tags
    };

    // Check if we need to evict items
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.stats.sets++;
    this.stats.size = this.cache.size;
    
    logger.debug(`Cache set for key: ${key}`, { metadata: { ttl, tags } });
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
      logger.debug(`Cache deleted for key: ${key}`);
    }
    return deleted;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.size--;
      return false;
    }
    
    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    logger.info('Cache cleared');
  }

  /**
   * Clear cache entries by tags
   */
  clearByTags(tags: string[]): number {
    let cleared = 0;
    
    this.cache.forEach((entry, key) => {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        cleared++;
      }
    });
    
    this.stats.size = this.cache.size;
    logger.info(`Cache cleared ${cleared} entries by tags`, { metadata: { tags } });
    return cleared;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();
    
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry, now)) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    this.stats.size = this.cache.size;
    
    if (cleaned > 0) {
      logger.debug(`Cache cleanup removed ${cleaned} expired entries`);
    }
    
    return cleaned;
  }

  /**
   * Memoize function with caching
   */
  memoize<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => TReturn | Promise<TReturn>,
    keyGenerator?: (...args: TArgs) => string,
    options: CacheOptions = {}
  ) {
    return async (...args: TArgs): Promise<TReturn> => {
      const key = keyGenerator ? keyGenerator(...args) : this.generateKey(fn.name, args);
      
      // Try to get from cache first
      const cached = this.get<TReturn>(key);
      if (cached !== null) {
        return cached;
      }
      
      // Execute function and cache result
      try {
        const result = await fn(...args);
        this.set(key, result, options);
        return result;
      } catch (error) {
        logger.error('Memoized function failed', error as Error, { metadata: { key, functionName: fn.name } });
        throw error;
      }
    };
  }

  /**
   * Create a cache wrapper for API calls
   */
  wrapApiCall<TArgs extends any[], TReturn>(
    apiCall: (...args: TArgs) => Promise<TReturn>,
    keyGenerator: (...args: TArgs) => string,
    options: CacheOptions = {}
  ) {
    return async (...args: TArgs): Promise<TReturn> => {
      const key = `api:${keyGenerator(...args)}`;
      
      // Try cache first
      const cached = this.get<TReturn>(key);
      if (cached !== null) {
        logger.debug('API call served from cache', { metadata: { key } });
        return cached;
      }
      
      // Make API call
      try {
        logger.debug('Making API call', { metadata: { key } });
        const result = await apiCall(...args);
        
        // Cache successful result
        this.set(key, result, {
          ttl: TIMING.CACHE_MEDIUM,
          tags: ['api'],
          ...options
        });
        
        return result;
      } catch (error) {
        logger.error('API call failed', error as Error, { metadata: { key } });
        throw error;
      }
    };
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): number {
    let invalidated = 0;
    
    this.cache.forEach((entry, key) => {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    });
    
    this.stats.size = this.cache.size;
    logger.info(`Invalidated ${invalidated} cache entries matching pattern`);
    return invalidated;
  }

  /**
   * Preload cache with data
   */
  preload<T>(entries: Array<{ key: string; data: T; options?: CacheOptions }>): void {
    for (const entry of entries) {
      this.set(entry.key, entry.data, entry.options);
    }
    logger.info(`Preloaded ${entries.length} cache entries`);
  }

  /**
   * Export cache data for persistence
   */
  export(): Array<CacheEntry> {
    return Array.from(this.cache.values());
  }

  /**
   * Import cache data from persistence
   */
  import(entries: Array<CacheEntry>): void {
    this.cache.clear();
    
    for (const entry of entries) {
      if (!this.isExpired(entry)) {
        this.cache.set(entry.key, entry);
      }
    }
    
    this.stats.size = this.cache.size;
    logger.info(`Imported ${this.cache.size} cache entries`);
  }

  /**
   * Destroy cache manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
    logger.info('Cache manager destroyed');
  }

  // Private methods
  private isExpired(entry: CacheEntry, now: number = Date.now()): boolean {
    return now - entry.timestamp > entry.ttl;
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug(`Evicted LRU cache entry: ${oldestKey}`);
    }
  }

  private generateKey(functionName: string, args: any[]): string {
    const argsString = JSON.stringify(args);
    return `${functionName}:${this.hashString(argsString)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, TIMING.CACHE_SHORT); // Cleanup every 5 minutes
  }


}

// Browser storage cache for persistence
class BrowserStorageCache {
  private storageKey = 'app_cache';
  private storage: Storage;

  constructor(useSessionStorage = false) {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
  }

  save(cache: CacheManager): void {
    try {
      const data = cache.export();
      this.storage.setItem(this.storageKey, JSON.stringify(data));
      logger.debug('Cache saved to browser storage');
    } catch (error) {
      logger.error('Failed to save cache to browser storage', error as Error);
    }
  }

  load(cache: CacheManager): void {
    try {
      const data = this.storage.getItem(this.storageKey);
      if (data) {
        const entries = JSON.parse(data);
        cache.import(entries);
        logger.debug('Cache loaded from browser storage');
      }
    } catch (error) {
      logger.error('Failed to load cache from browser storage', error as Error);
    }
  }

  clear(): void {
    this.storage.removeItem(this.storageKey);
    logger.debug('Cache cleared from browser storage');
  }
}

// Create singleton instances
export const cache = new CacheManager(LIMITS.MAX_STORED_LOGS * 10);
export const browserCache = new BrowserStorageCache();

// Utility functions
export const createCacheKey = (...parts: (string | number)[]): string => {
  return parts.join(':');
};

export const withCache = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyGenerator: (...args: TArgs) => string,
  options: CacheOptions = {}
) => {
  return cache.wrapApiCall(fn, keyGenerator, options);
};

export const memoize = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn | Promise<TReturn>,
  keyGenerator?: (...args: TArgs) => string,
  options: CacheOptions = {}
) => {
  return cache.memoize(fn, keyGenerator, options);
};

// Cache decorators
export function Cached(options: CacheOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = cache.memoize(originalMethod, undefined, options);
    
    return descriptor;
  };
}

// Initialize browser cache persistence
if (typeof window !== 'undefined') {
  // Load cache on startup
  browserCache.load(cache);
  
  // Save cache before page unload
  window.addEventListener('beforeunload', () => {
    browserCache.save(cache);
  });
  
  // Periodic save with cleanup
  const saveInterval = setInterval(() => {
    browserCache.save(cache);
  }, TIMING.CACHE_SHORT);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(saveInterval);
    cache.destroy();
  });
}

export default cache;