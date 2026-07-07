/**
 * In-memory rate limiter for API routes
 * Note: In production, consider using Redis for distributed rate limiting
 */

interface RateLimitRecord {
  count: number
  lastReset: number
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Configuration
const WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS = 100 // max requests per window

// Clean up old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.lastReset > WINDOW_MS * 2) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback
  return 'unknown'
}

/**
 * Check rate limit and return result
 * @param identifier - Unique identifier (usually IP or user ID)
 * @param options - Custom options
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): { success: boolean; remaining: number; resetAt: number } {
  // Run cleanup occasionally
  cleanup()

  const maxRequests = options.maxRequests ?? MAX_REQUESTS
  const windowMs = options.windowMs ?? WINDOW_MS

  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // Initialize or reset if window expired
  if (!record || now - record.lastReset > windowMs) {
    rateLimitStore.set(identifier, { count: 1, lastReset: now })
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    }
  }

  // Increment count
  record.count++

  // Check if limit exceeded
  if (record.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.lastReset + windowMs,
    }
  }

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetAt: record.lastReset + windowMs,
  }
}

/**
 * Create a rate limit response if limit exceeded
 */
export function getRateLimitResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(resetAt),
      },
    }
  )
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(remaining: number, resetAt: number): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
  }
}

// Stricter rate limits for specific endpoints
export const RATE_LIMITS = {
  // AI endpoint - stricter due to cost
  ai: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute

  // Auth endpoints - prevent brute force
  auth: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute

  // General API - standard
  general: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute

  // Upload endpoint - strict
  upload: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
} as const

export type RateLimitType = keyof typeof RATE_LIMITS
