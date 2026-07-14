/**
 * Distributed Rate Limiter for PitchFlow
 * Uses Upstash Redis for distributed rate limiting across multiple server instances
 */

import { Redis } from '@upstash/redis'

// ============================================
// Redis Client Configuration
// ============================================

// Check if Redis credentials are available
const hasRedisConfig = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
)

// Create Redis client only if credentials are available
let redis: Redis | null = null

if (hasRedisConfig) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// ============================================
// Rate Limit Configuration
// ============================================

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

// ============================================
// In-Memory Fallback (for development)
// ============================================

interface RateLimitRecord {
  count: number
  lastReset: number
}

// In-memory store (used when Redis is not available)
const inMemoryStore = new Map<string, RateLimitRecord>()

// Cleanup interval for in-memory store
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupInMemory(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, record] of inMemoryStore.entries()) {
    // Clean up entries older than 2 windows
    if (now - record.lastReset > 60 * 60 * 1000) {
      inMemoryStore.delete(key)
    }
  }
  lastCleanup = now
}

// ============================================
// IP Extraction
// ============================================

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

// ============================================
// Redis-Based Rate Limiting
// ============================================

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
  isDistributed: boolean
}

/**
 * Check rate limit using Redis (production)
 */
async function checkRedisRateLimit(
  identifier: string,
  options: { maxRequests: number; windowMs: number }
): Promise<RateLimitResult> {
  if (!redis) {
    throw new Error('Redis not configured')
  }

  const { maxRequests, windowMs } = options
  const now = Date.now()
  const key = `ratelimit:${identifier}`

  // Use Redis MULTI/EXEC for atomic operations
  // Using INCR and EXPIRE commands

  // Increment the counter
  const count = await redis.incr(key)

  if (count === 1) {
    // First request, set expiration
    await redis.expire(key, Math.ceil(windowMs / 1000))
  }

  // Get TTL for reset time
  const ttl = await redis.ttl(key)
  const resetAt = now + (ttl > 0 ? ttl * 1000 : windowMs)

  return {
    success: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetAt,
    isDistributed: true,
  }
}

/**
 * Check rate limit using in-memory store (development)
 */
function checkInMemoryRateLimit(
  identifier: string,
  options: { maxRequests: number; windowMs: number }
): RateLimitResult {
  cleanupInMemory()

  const { maxRequests, windowMs } = options
  const now = Date.now()
  const record = inMemoryStore.get(identifier)

  // Initialize or reset if window expired
  if (!record || now - record.lastReset > windowMs) {
    inMemoryStore.set(identifier, { count: 1, lastReset: now })
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
      isDistributed: false,
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
      isDistributed: false,
    }
  }

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetAt: record.lastReset + windowMs,
    isDistributed: false,
  }
}

// ============================================
// Main Rate Limit Function
// ============================================

/**
 * Check rate limit and return result
 * Automatically uses Redis in production, falls back to in-memory in development
 *
 * @param identifier - Unique identifier (usually IP or user ID)
 * @param options - Custom options
 * @returns Rate limit result
 */
export async function rateLimit(
  identifier: string,
  options: { maxRequests?: number; windowMs?: number; type?: RateLimitType } = {}
): Promise<RateLimitResult> {
  const maxRequests = options.maxRequests ?? RATE_LIMITS.general.maxRequests
  const windowMs = options.windowMs ?? RATE_LIMITS.general.windowMs

  // Try Redis first if available
  if (redis) {
    try {
      return await checkRedisRateLimit(identifier, { maxRequests, windowMs })
    } catch (error) {
      console.error('[RateLimit] Redis error, falling back to in-memory:', error)
      // Fall through to in-memory
    }
  }

  // Fallback to in-memory
  return checkInMemoryRateLimit(identifier, { maxRequests, windowMs })
}

/**
 * Get rate limit for a specific type
 */
export function getRateLimitConfig(type: RateLimitType) {
  return RATE_LIMITS[type]
}

// ============================================
// Response Helpers
// ============================================

/**
 * Create a rate limit exceeded response
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
export function getRateLimitHeaders(
  remaining: number,
  resetAt: number,
  isDistributed?: boolean
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
    'X-RateLimit-Policy': isDistributed ? 'distributed' : 'local',
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return hasRedisConfig && redis !== null
}

/**
 * Get rate limit store type
 */
export function getRateLimitStoreType(): 'redis' | 'memory' {
  return hasRedisConfig ? 'redis' : 'memory'
}

/**
 * Clear all rate limits (for testing)
 */
export async function clearRateLimits(): Promise<void> {
  if (redis) {
    const keys = await redis.keys('ratelimit:*')
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
  inMemoryStore.clear()
}

/**
 * Get rate limit status for an identifier
 */
export async function getRateLimitStatus(
  identifier: string
): Promise<{
  current: number
  limit: number
  remaining: number
  resetAt: number
  storeType: 'redis' | 'memory'
}> {
  const limit = RATE_LIMITS.general.maxRequests

  if (redis) {
    try {
      const key = `ratelimit:${identifier}`
      const count = await redis.get<number>(key)
      const ttl = await redis.ttl(key)

      return {
        current: count ?? 0,
        limit,
        remaining: Math.max(0, limit - (count ?? 0)),
        resetAt: Date.now() + (ttl > 0 ? ttl * 1000 : 60000),
        storeType: 'redis',
      }
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const record = inMemoryStore.get(identifier)
  const current = record?.count ?? 0
  const resetAt = (record?.lastReset ?? Date.now()) + 60000

  return {
    current,
    limit,
    remaining: Math.max(0, limit - current),
    resetAt,
    storeType: 'memory',
  }
}
