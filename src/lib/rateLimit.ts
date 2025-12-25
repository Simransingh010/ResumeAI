import { RATE_LIMIT } from "./constants";

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, RATE_LIMIT.WINDOW_MS);

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

/**
 * Check if a request is rate limited
 * @param identifier - Unique identifier (e.g., user ID or IP)
 * @returns Rate limit result
 */
export function checkRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // If no entry or entry has expired, create new entry
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + RATE_LIMIT.WINDOW_MS,
        });
        return {
            allowed: true,
            remaining: RATE_LIMIT.MAX_REQUESTS - 1,
            resetTime: now + RATE_LIMIT.WINDOW_MS,
        };
    }

    // Increment count
    entry.count++;

    // Check if over limit
    if (entry.count > RATE_LIMIT.MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        "X-RateLimit-Limit": RATE_LIMIT.MAX_REQUESTS.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
    };
}
