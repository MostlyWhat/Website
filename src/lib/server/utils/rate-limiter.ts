/**
 * Rate Limiter Utility
 * 
 * Provides rate limiting functionality to prevent abuse of API endpoints.
 * Uses in-memory storage with optional Redis backend for production.
 */

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Rate limiter using sliding window algorithm
 */
export class RateLimiter {
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    /**
     * Check if request should be allowed
     * @param identifier - Unique identifier (IP address, user ID, etc.)
     * @returns Object with success status and remaining requests
     */
    async check(identifier: string): Promise<{
        success: boolean;
        remaining: number;
        resetTime: number;
    }> {
        const now = Date.now();
        const key = `ratelimit:${identifier}`;

        // Get current limit data
        let limitData = rateLimitStore.get(key);

        // Clean up expired entries
        if (limitData && now >= limitData.resetTime) {
            rateLimitStore.delete(key);
            limitData = undefined;
        }

        // Initialize if doesn't exist
        if (!limitData) {
            limitData = {
                count: 0,
                resetTime: now + this.config.windowMs
            };
        }

        // Check if limit exceeded
        if (limitData.count >= this.config.maxRequests) {
            return {
                success: false,
                remaining: 0,
                resetTime: limitData.resetTime
            };
        }

        // Increment counter
        limitData.count++;
        rateLimitStore.set(key, limitData);

        return {
            success: true,
            remaining: this.config.maxRequests - limitData.count,
            resetTime: limitData.resetTime
        };
    }

    /**
     * Reset rate limit for an identifier
     */
    async reset(identifier: string): Promise<void> {
        const key = `ratelimit:${identifier}`;
        rateLimitStore.delete(key);
    }
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
    // Contact form: 5 requests per 10 minutes
    contact: new RateLimiter({
        windowMs: 10 * 60 * 1000,
        maxRequests: 5
    }),

    // File uploads: 10 uploads per hour
    upload: new RateLimiter({
        windowMs: 60 * 60 * 1000,
        maxRequests: 10
    }),

    // Search: 30 searches per minute
    search: new RateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 30
    }),

    // Authentication: 5 attempts per 15 minutes
    auth: new RateLimiter({
        windowMs: 15 * 60 * 1000,
        maxRequests: 5
    }),

    // API general: 100 requests per minute
    api: new RateLimiter({
        windowMs: 60 * 1000,
        maxRequests: 100
    })
};

/**
 * Helper to get client IP address from request
 */
export function getClientIP(request: Request, headers: Headers): string {
    // Try Cloudflare header first
    const cfConnectingIp = headers.get('cf-connecting-ip');
    if (cfConnectingIp) return cfConnectingIp;

    // Try X-Forwarded-For
    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }

    // Try X-Real-IP
    const xRealIp = headers.get('x-real-ip');
    if (xRealIp) return xRealIp;

    // Fallback to 'unknown'
    return 'unknown';
}

/**
 * Clean up expired rate limit entries periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (now >= data.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000); // Clean up every minute
