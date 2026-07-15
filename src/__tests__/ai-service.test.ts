/**
 * Unit Tests for AI Service
 *
 * Run with: npm test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: 'Mocked AI response for testing',
            },
          ],
          usage: {
            input_tokens: 100,
            output_tokens: 50,
          },
        }),
      },
    })),
  }
})

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateCreativeIdeas', () => {
    it('should be defined as a function', async () => {
      const { generateCreativeIdeas } = await import('@/lib/ai-service')
      expect(typeof generateCreativeIdeas).toBe('function')
    })

    it('should return an object with success field', async () => {
      const { generateCreativeIdeas } = await import('@/lib/ai-service')
      const result = await generateCreativeIdeas({
        brandName: 'Test Brand',
        industry: 'Automotive',
        programType: 'Morning Show',
      })

      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('analyzeBrand', () => {
    it('should be defined as a function', async () => {
      const { analyzeBrand } = await import('@/lib/ai-service')
      expect(typeof analyzeBrand).toBe('function')
    })

    it('should return response object', async () => {
      const { analyzeBrand } = await import('@/lib/ai-service')
      const result = await analyzeBrand({
        brandName: 'Honda',
        industry: 'Automotive',
      })

      expect(result).toHaveProperty('success')
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('analyzeBrandDNA', () => {
    it('should be defined as a function', async () => {
      const { analyzeBrandDNA } = await import('@/lib/ai-service')
      expect(typeof analyzeBrandDNA).toBe('function')
    })

    it('should handle competitor brands parameter', async () => {
      const { analyzeBrandDNA } = await import('@/lib/ai-service')
      const result = await analyzeBrandDNA({
        brandName: 'Toyota',
        industry: 'Automotive',
        competitorBrands: ['Honda', 'Mitsubishi', 'Suzuki'],
      })

      expect(result).toHaveProperty('success')
    })
  })

  describe('generateProposalContent', () => {
    it('should be defined as a function', async () => {
      const { generateProposalContent } = await import('@/lib/ai-service')
      expect(typeof generateProposalContent).toBe('function')
    })

    it('should handle optional parameters', async () => {
      const { generateProposalContent } = await import('@/lib/ai-service')
      const result = await generateProposalContent({
        brandName: 'Samsung',
        programName: 'TV Show',
        objective: 'Brand awareness',
      })

      expect(result).toHaveProperty('success')
    })
  })

  describe('searchReference', () => {
    it('should be defined as a function', async () => {
      const { searchReference } = await import('@/lib/ai-service')
      expect(typeof searchReference).toBe('function')
    })
  })

  describe('improveText', () => {
    it('should be defined as a function', async () => {
      const { improveText } = await import('@/lib/ai-service')
      expect(typeof improveText).toBe('function')
    })

    it('should handle text improvement request', async () => {
      const { improveText } = await import('@/lib/ai-service')
      const result = await improveText({
        text: 'This is a test proposal text',
        type: 'proposal',
      })

      expect(result).toHaveProperty('success')
    })
  })

  describe('trendAnalysis', () => {
    it('should be defined as a function', async () => {
      const { trendAnalysis } = await import('@/lib/ai-service')
      expect(typeof trendAnalysis).toBe('function')
    })

    it('should handle optional industry parameter', async () => {
      const { trendAnalysis } = await import('@/lib/ai-service')
      const result = await trendAnalysis({})

      expect(result).toHaveProperty('success')
    })
  })

  describe('audienceInsights', () => {
    it('should be defined as a function', async () => {
      const { audienceInsights } = await import('@/lib/ai-service')
      expect(typeof audienceInsights).toBe('function')
    })
  })

  describe('calculateROI', () => {
    it('should be defined as a function', async () => {
      const { calculateROI } = await import('@/lib/ai-service')
      expect(typeof calculateROI).toBe('function')
    })

    it('should calculate ROI with budget and program', async () => {
      const { calculateROI } = await import('@/lib/ai-service')
      const result = await calculateROI({
        budget: 'Rp 100.000.000',
        program: 'Morning Show',
      })

      expect(result).toHaveProperty('success')
    })
  })

  describe('callAIAction', () => {
    it('should be defined as a function', async () => {
      const { callAIAction } = await import('@/lib/ai-service')
      expect(typeof callAIAction).toBe('function')
    })

    it('should be an async function', async () => {
      const { callAIAction } = await import('@/lib/ai-service')

      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test' }),
      })

      const result = await callAIAction('analyzeBrand', { brandName: 'Test' })

      expect(result).toHaveProperty('success')
      vi.restoreAllMocks()
    })
  })
})
