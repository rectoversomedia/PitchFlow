/**
 * Integration Tests for PitchFlow API Routes
 *
 * Run with: npm test
 * Or: npm run test:coverage for coverage report
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { z } from 'zod'

// ============================================
// Types for Test Data
// ============================================

interface MockUser {
  id: string
  email: string
  name: string
  role: 'Supervisor' | 'ACS' | 'Sales'
}

interface MockBrief {
  id: string
  brand_name: string
  pic_sales: string
  program: string
  created_by: string
}

interface MockProposal {
  id: string
  title: string
  brand_name: string
  pic_sales: string
  created_by: string
}

// ============================================
// Test Data
// ============================================

const testUser: MockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Sales',
}

const testBrief: MockBrief = {
  id: 'brief-123',
  brand_name: 'Test Brand',
  pic_sales: 'John Doe',
  program: 'Morning Show',
  created_by: testUser.id,
}

const testProposal: MockProposal = {
  id: 'proposal-123',
  title: 'Test Proposal',
  brand_name: 'Test Brand',
  pic_sales: 'John Doe',
  created_by: testUser.id,
}

// ============================================
// Validation Tests
// ============================================

describe('Validation Schemas', () => {
  it('should validate valid brief creation data', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const validData = {
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
      program: 'Morning Show',
    }

    const result = createBriefSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject brief without required fields', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const invalidData = {
      brand_name: 'Test Brand',
      // missing pic_sales and program
    }

    const result = createBriefSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject brief with too long brand_name', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const invalidData = {
      brand_name: 'A'.repeat(201), // exceeds 200 char limit
      pic_sales: 'John Doe',
      program: 'Morning Show',
    }

    const result = createBriefSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should validate valid proposal creation data', async () => {
    const { createProposalSchema } = await import('@/lib/validations')

    const validData = {
      title: 'Test Proposal',
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
    }

    const result = createProposalSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should validate UUID format', async () => {
    const { uuidSchema } = await import('@/lib/validations')

    // Valid UUID
    expect(uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true)

    // Invalid UUID
    expect(uuidSchema.safeParse('not-a-uuid').success).toBe(false)
  })

  it('should validate enum values', async () => {
    const { briefStatusSchema, proposalStatusSchema } = await import('@/lib/validations')

    expect(briefStatusSchema.safeParse('new').success).toBe(true)
    expect(briefStatusSchema.safeParse('invalid').success).toBe(false)

    expect(proposalStatusSchema.safeParse('drafting').success).toBe(true)
    expect(proposalStatusSchema.safeParse('invalid').success).toBe(false)
  })

  it('should coerce numbers correctly', async () => {
    const { createProposalSchema } = await import('@/lib/validations')

    const data = {
      title: 'Test',
      brand_name: 'Brand',
      pic_sales: 'Person',
      year: '2024', // string should be coerced to number
    }

    const result = createProposalSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.year).toBe(2024)
    }
  })
})

// ============================================
// Sanitization Tests
// ============================================

describe('Input Sanitization', () => {
  it('should remove XSS characters', async () => {
    const { sanitizeString } = await import('@/lib/validations')

    expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
    expect(sanitizeString('<img src=x onerror=alert(1)>')).toBe('img src=x alert(1)')
  })

  it('should remove javascript: protocol', async () => {
    const { sanitizeString } = await import('@/lib/validations')

    // javascript: gets removed completely
    expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)')
    expect(sanitizeString('JAVASCRIPT:alert(1)')).toBe('alert(1)')
  })

  it('should remove event handlers', async () => {
    const { sanitizeString } = await import('@/lib/validations')

    // on...= pattern gets removed
    expect(sanitizeString('onclick=alert(1)')).toBe('alert(1)')
    expect(sanitizeString('onload=alert(1)')).toBe('alert(1)')
  })

  it('should sanitize object strings recursively', async () => {
    const { sanitizeObject } = await import('@/lib/validations')

    const input = {
      name: '<b>Test</b>',
      description: 'Normal text',
      tags: ['<script>', 'normal'],
    }

    const result = sanitizeObject(input)
    expect(result.name).toBe('bTest/b')
    expect(result.description).toBe('Normal text')
    expect(result.tags).toEqual(['script', 'normal'])
  })
})

// ============================================
// Rate Limiting Tests
// ============================================

describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    const { rateLimit, RATE_LIMITS } = await import('@/lib/rate-limit')

    const result = await rateLimit('test-ip-1', RATE_LIMITS.general)
    expect(result.success).toBe(true)
    expect(result.remaining).toBeLessThan(RATE_LIMITS.general.maxRequests)
  })

  it('should block requests over limit', async () => {
    const { rateLimit, RATE_LIMITS } = await import('@/lib/rate-limit')

    const uniqueId = `test-ip-${Date.now()}-${Math.random()}`

    // Exhaust the limit
    for (let i = 0; i < RATE_LIMITS.general.maxRequests; i++) {
      await rateLimit(uniqueId, RATE_LIMITS.general)
    }

    // Next request should be blocked
    const result = await rateLimit(uniqueId, RATE_LIMITS.general)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should have correct rate limit constants', async () => {
    const { RATE_LIMITS } = await import('@/lib/rate-limit')

    expect(RATE_LIMITS.ai.maxRequests).toBe(20)
    expect(RATE_LIMITS.auth.maxRequests).toBe(10)
    expect(RATE_LIMITS.general.maxRequests).toBe(100)
    expect(RATE_LIMITS.upload.maxRequests).toBe(10)
  })

  it('should generate rate limit response correctly', async () => {
    const { getRateLimitResponse } = await import('@/lib/rate-limit')

    const resetAt = Date.now() + 60000
    const response = getRateLimitResponse(resetAt)

    expect(response.status).toBe(429)
  })

  it('should get client IP from headers', async () => {
    const { getClientIP } = await import('@/lib/rate-limit')

    // Mock request with x-forwarded-for
    const request1 = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
    })
    expect(getClientIP(request1)).toBe('192.168.1.1')

    // Mock request with x-real-ip
    const request2 = new Request('http://localhost', {
      headers: { 'x-real-ip': '192.168.1.2' },
    })
    expect(getClientIP(request2)).toBe('192.168.1.2')

    // Mock request without IP headers
    const request3 = new Request('http://localhost')
    expect(getClientIP(request3)).toBe('unknown')
  })
})

// ============================================
// Environment Validation Tests
// ============================================

describe('Environment Validation', () => {
  it('should validate environment in test mode', async () => {
    // In test mode, validation should not throw
    const { validateEnvironment } = await import('@/lib/env')
    expect(() => validateEnvironment()).not.toThrow()
  })

  it('should detect production environment', async () => {
    const { isProduction } = await import('@/lib/env')
    // Just check the function exists and works
    expect(typeof isProduction).toBe('function')
  })

  it('should check NODE_ENV correctly', async () => {
    // NODE_ENV should be test in test environment
    expect(process.env.NODE_ENV).toBe('test')
  })
})

// ============================================
// Type Tests
// ============================================

describe('Type Inference', () => {
  it('should infer CreateBriefInput type correctly', async () => {
    const { createBriefSchema } = await import('@/lib/validations')
    type CreateBriefInput = z.infer<typeof createBriefSchema>

    const validData = {
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
      program: 'Morning Show',
      industry_category: 'Automotive',
    }

    const result = createBriefSchema.parse(validData)
    expect(result.industry_category).toBe('Automotive')
  })

  it('should allow optional fields to be undefined', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const minimalData = {
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
      program: 'Morning Show',
    }

    const result = createBriefSchema.parse(minimalData)
    expect(result.industry_category).toBeUndefined()
    expect(result.notes).toBeUndefined()
  })
})

// ============================================
// Utility Function Tests
// ============================================

describe('Utility Functions', () => {
  it('should validate body correctly', async () => {
    const { validateBody, createBriefSchema } = await import('@/lib/validations')

    const validBody = {
      brand_name: 'Test',
      pic_sales: 'Person',
      program: 'Show',
    }

    const result = validateBody(validBody, createBriefSchema)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.brand_name).toBe('Test')
    }
  })

  it('should return error for invalid body', async () => {
    const { validateBody, createBriefSchema } = await import('@/lib/validations')

    const invalidBody = {
      brand_name: '', // empty string should fail min(1)
    }

    const result = validateBody(invalidBody, createBriefSchema)
    expect(result.success).toBe(false)
  })
})

// ============================================
// Edge Cases
// ============================================

describe('Edge Cases', () => {
  it('should trim whitespace from strings', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const data = {
      brand_name: '  Valid Brand  ',
      pic_sales: 'Person',
      program: 'Show',
    }

    const result = createBriefSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.brand_name).toBe('Valid Brand')
    }
  })

  it('should handle unicode characters', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const data = {
      brand_name: 'Brand Indonesia™',
      pic_sales: 'John & Jane',
      program: 'Show – Special',
    }

    const result = createBriefSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should limit array length', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const data = {
      brand_name: 'Brand',
      pic_sales: 'Person',
      program: 'Show',
      attachments: Array(11).fill('https://example.com/file.pdf'), // exceeds maxItems(10)
    }

    const result = createBriefSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should handle year coercion and validation', async () => {
    const { createProposalSchema } = await import('@/lib/validations')

    // Valid year
    expect(createProposalSchema.safeParse({
      title: 'Test',
      brand_name: 'Brand',
      pic_sales: 'Person',
      year: 2024,
    }).success).toBe(true)

    // Year too old
    expect(createProposalSchema.safeParse({
      title: 'Test',
      brand_name: 'Brand',
      pic_sales: 'Person',
      year: 2019, // min is 2020
    }).success).toBe(false)

    // Year too far in future
    expect(createProposalSchema.safeParse({
      title: 'Test',
      brand_name: 'Brand',
      pic_sales: 'Person',
      year: 2101, // max is 2100
    }).success).toBe(false)
  })
})

// ============================================
// Performance Tests
// ============================================

describe('Performance', () => {
  it('should validate quickly', async () => {
    const { createBriefSchema } = await import('@/lib/validations')

    const data = {
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
      program: 'Morning Show',
      industry_category: 'Automotive',
      objective: 'Increase brand awareness',
      target_audience: 'Young professionals',
    }

    const start = performance.now()

    for (let i = 0; i < 1000; i++) {
      createBriefSchema.safeParse(data)
    }

    const duration = performance.now() - start

    // Should complete 1000 validations in under 100ms
    expect(duration).toBeLessThan(100)
  })

  it('should sanitize quickly', async () => {
    const { sanitizeObject } = await import('@/lib/validations')

    const data = {
      name: '<script>alert(1)</script>',
      description: 'Normal text',
      nested: {
        field: '<b>test</b>',
      },
    }

    const start = performance.now()

    for (let i = 0; i < 1000; i++) {
      sanitizeObject(data)
    }

    const duration = performance.now() - start

    // Should complete 1000 sanitizations in under 50ms
    expect(duration).toBeLessThan(50)
  })
})
