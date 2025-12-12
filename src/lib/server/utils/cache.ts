/**
 * Server-side caching utilities for performance optimization
 * 
 * Provides cache header configurations for different content types
 * and helper functions for managing caching strategies.
 */

export interface CacheConfig {
    /**
     * Maximum age in seconds that the content can be cached
     */
    maxAge: number;
    
    /**
     * Time in seconds that stale content can be served while revalidating
     */
    staleWhileRevalidate?: number;
    
    /**
     * Whether the cache is public (can be cached by CDNs) or private (browser only)
     */
    visibility?: 'public' | 'private';
    
    /**
     * Whether the content is immutable (never changes)
     */
    immutable?: boolean;
}

/**
 * Predefined cache configurations for different content types
 */
export const CachePresets = {
    /**
     * Static content that rarely changes (e.g., support articles, documentation)
     * Cache for 10 minutes, allow stale content for up to 1 hour
     */
    STATIC_LONG: {
        maxAge: 600,
        staleWhileRevalidate: 3600,
        visibility: 'public'
    } as CacheConfig,
    
    /**
     * Dynamic content that changes occasionally (e.g., blog posts, projects)
     * Cache for 5 minutes, allow stale content for up to 30 minutes
     */
    DYNAMIC_MEDIUM: {
        maxAge: 300,
        staleWhileRevalidate: 1800,
        visibility: 'public'
    } as CacheConfig,
    
    /**
     * Real-time content that changes frequently (e.g., status page, notifications)
     * Cache for 1 minute, allow stale content for up to 5 minutes
     */
    REALTIME_SHORT: {
        maxAge: 60,
        staleWhileRevalidate: 300,
        visibility: 'public'
    } as CacheConfig,
    
    /**
     * API responses that can be cached
     * Cache for 5 minutes, allow stale content for up to 10 minutes
     */
    API_RESPONSE: {
        maxAge: 300,
        staleWhileRevalidate: 600,
        visibility: 'public'
    } as CacheConfig,
    
    /**
     * Authenticated/personalized content (no CDN caching)
     * Cache in browser only for 5 minutes
     */
    PRIVATE: {
        maxAge: 300,
        visibility: 'private'
    } as CacheConfig,
    
    /**
     * No caching at all (always fetch fresh)
     */
    NO_CACHE: {
        maxAge: 0,
        visibility: 'private'
    } as CacheConfig,
    
    /**
     * Immutable assets (hashed filenames that never change)
     * Cache for 1 year
     */
    IMMUTABLE: {
        maxAge: 31536000,
        immutable: true,
        visibility: 'public'
    } as CacheConfig
} as const;

/**
 * Generate Cache-Control header value from configuration
 */
export function buildCacheHeader(config: CacheConfig): string {
    const parts: string[] = [];
    
    // Visibility
    parts.push(config.visibility || 'public');
    
    // Max age
    if (config.maxAge === 0) {
        parts.push('no-cache', 'no-store', 'must-revalidate');
    } else {
        parts.push(`max-age=${config.maxAge}`);
    }
    
    // Stale while revalidate
    if (config.staleWhileRevalidate && config.staleWhileRevalidate > 0) {
        parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
    }
    
    // Immutable
    if (config.immutable) {
        parts.push('immutable');
    }
    
    return parts.join(', ');
}

/**
 * Helper to set cache headers in a SvelteKit page/endpoint
 */
export function setCacheHeaders(setHeaders: (headers: Record<string, string>) => void, config: CacheConfig): void {
    setHeaders({
        'Cache-Control': buildCacheHeader(config)
    });
}

/**
 * Generate ETag from content for conditional requests
 */
export function generateETag(content: string): string {
    // Simple hash function for ETag generation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Check if content matches ETag (for 304 responses)
 */
export function matchesETag(ifNoneMatch: string | null, etag: string): boolean {
    if (!ifNoneMatch) return false;
    return ifNoneMatch === etag;
}

/**
 * Cache key generation for consistent cache keys
 */
export function generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
}

/**
 * Performance monitoring helper
 */
export interface CacheMetrics {
    hit: boolean;
    duration: number;
    key: string;
}

export function createCacheTimer(key: string) {
    const start = performance.now();
    
    return {
        hit: (): CacheMetrics => ({
            hit: true,
            duration: performance.now() - start,
            key
        }),
        miss: (): CacheMetrics => ({
            hit: false,
            duration: performance.now() - start,
            key
        })
    };
}
