/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * Note: For production with multiple servers, use Redis or Supabase
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (resets on server restart)
// For production, consider using Redis or Supabase Edge Functions
const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limit configurations
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // AI endpoints - stricter limits due to cost
  ai: {
    maxRequests: 10,    // 10 requests
    windowMs: 60 * 1000, // per minute
  },
  aiGenerate: {
    maxRequests: 5,     // 5 requests
    windowMs: 60 * 1000, // per minute
  },
  // Auth endpoints
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // per minute
  },
  // Data endpoints
  data: {
    maxRequests: 100,
    windowMs: 60 * 1000, // per minute
  },
  // Upload endpoints
  upload: {
    maxRequests: 20,
    windowMs: 60 * 1000, // per minute
  },
  // Default
  default: {
    maxRequests: 100,
    windowMs: 60 * 1000, // per minute
  },
}

/**
 * Generate a unique key for rate limiting
 */
function getRateLimitKey(ip: string, identifier: string): string {
  return `${ip}:${identifier}`
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

/**
 * Check rate limit and return result
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(
  ip: string,
  identifier: string = 'default'
): RateLimitResult {
  const config = RATE_LIMITS[identifier] || RATE_LIMITS.default
  const key = getRateLimitKey(ip, identifier)
  const now = Date.now()

  let entry = rateLimitStore.get(key)

  // Reset if window has passed
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  entry.count++

  const remaining = Math.max(0, config.maxRequests - entry.count)
  const success = entry.count <= config.maxRequests
  const retryAfter = success ? undefined : Math.ceil((entry.resetTime - now) / 1000)

  return {
    success,
    limit: config.maxRequests,
    remaining,
    resetTime: entry.resetTime,
    retryAfter,
  }
}

/**
 * Create rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    ...(result.retryAfter ? { 'Retry-After': result.retryAfter.toString() } : {}),
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Check common headers for client IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback
  return '127.0.0.1'
}
