import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, getIdentifier } from '@/lib/rate-limit'

// Mock NextRequest
const createMockRequest = (ip: string = '127.0.0.1') => ({
  headers: {
    get: (name: string) => {
      if (name === 'x-forwarded-for') return ip
      if (name === 'x-real-ip') return ip
      return null
    },
  },
}) as any

describe('Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getIdentifier', () => {
    it('should return user-based identifier when userId provided', () => {
      const req = createMockRequest()
      const result = getIdentifier(req, 'user123')
      expect(result).toBe('user:user123')
    })

    it('should return IP-based identifier when no userId', () => {
      const req = createMockRequest('192.168.1.1')
      const result = getIdentifier(req)
      expect(result).toBe('ip:192.168.1.1')
    })

    it('should handle x-forwarded-for with multiple IPs', () => {
      const req = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1'
            return null
          },
        },
      } as any
      const result = getIdentifier(req)
      expect(result).toBe('ip:192.168.1.1')
    })
  })

  describe('rateLimit', () => {
    it('should allow requests under limit (in-memory fallback)', async () => {
      const result = await rateLimit('test-user', 'api')
      expect(result.success).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('should have different limits for different types', async () => {
      const apiResult = await rateLimit('test-api-1', 'api')
      const authResult = await rateLimit('test-auth-1', 'auth')
      const generateResult = await rateLimit('test-gen-1', 'generate')

      expect(apiResult.limit).toBe(100)
      expect(authResult.limit).toBe(10)
      expect(generateResult.limit).toBe(5)
    })
  })
})
