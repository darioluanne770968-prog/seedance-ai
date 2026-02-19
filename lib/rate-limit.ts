import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis client (or use in-memory fallback for development)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null

// In-memory rate limiting for development
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimiters = {
  // General API - 100 requests per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // Auth endpoints - 10 requests per minute (prevent brute force)
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // Video generation - 5 requests per minute (expensive operation)
  generate: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: 'ratelimit:generate',
      })
    : null,

  // Upload - 20 requests per minute
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'ratelimit:upload',
      })
    : null,

  // Strict - 3 requests per minute (for sensitive operations)
  strict: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 m'),
        analytics: true,
        prefix: 'ratelimit:strict',
      })
    : null,
}

type RateLimiterType = keyof typeof rateLimiters

/**
 * In-memory rate limit check (for development without Redis)
 */
function inMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = identifier

  const record = inMemoryStore.get(key)

  if (!record || now > record.resetAt) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, reset: now + windowMs }
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetAt }
  }

  record.count++
  return { success: true, remaining: limit - record.count, reset: record.resetAt }
}

/**
 * Rate limit check
 */
export async function rateLimit(
  identifier: string,
  type: RateLimiterType = 'api'
): Promise<{
  success: boolean
  remaining: number
  reset: number
  limit: number
}> {
  const limiter = rateLimiters[type]

  // Fallback limits for in-memory
  const inMemoryLimits: Record<RateLimiterType, { limit: number; window: number }> = {
    api: { limit: 100, window: 60000 },
    auth: { limit: 10, window: 60000 },
    generate: { limit: 5, window: 60000 },
    upload: { limit: 20, window: 60000 },
    strict: { limit: 3, window: 60000 },
  }

  if (!limiter) {
    // Use in-memory fallback
    const config = inMemoryLimits[type]
    const result = inMemoryRateLimit(`${type}:${identifier}`, config.limit, config.window)
    return {
      ...result,
      limit: config.limit,
    }
  }

  const result = await limiter.limit(identifier)

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  }
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Get IP from headers
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  return `ip:${ip}`
}

/**
 * Middleware helper for rate limiting
 */
export async function withRateLimit(
  req: NextRequest,
  type: RateLimiterType = 'api',
  userId?: string
): Promise<NextResponse | null> {
  const identifier = getIdentifier(req, userId)
  const result = await rateLimit(identifier, type)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please slow down and try again later',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: { remaining: number; reset: number; limit: number }
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  return response
}
