import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { rateLimit, getRateLimitResponse, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit'
import {
  analyzeBrandDNA,
  analyzeBrand,
  generateCreativeIdeas,
  generateProposalContent,
  searchReference,
  improveText,
  trendAnalysis,
  audienceInsights,
  calculateROI,
} from '@/lib/ai-service'

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .trim()
}

// Valid AI actions
const VALID_ACTIONS = [
  'brandDNA',
  'analyzeBrand',
  'generateIdeas',
  'generateProposal',
  'searchReference',
  'improveText',
  'trendAnalysis',
  'audienceInsights',
  'calculateROI',
] as const

type AIAction = (typeof VALID_ACTIONS)[number]

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    // Rate limiting using user ID (more accurate than IP for logged-in users)
    const identifier =
      authUser.id ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'

    // Since rateLimit is now async, handle accordingly
    const rateLimitResult = await rateLimit(identifier, RATE_LIMITS.ai)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const body = await request.json()
    const { action, params } = body

    // Validate action
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Valid actions: ${VALID_ACTIONS.join(', ')}`,
        },
        { status: 400 }
      )
    }

    let result: string
    let error: string | undefined

    // Route to appropriate AI function with sanitized params
    try {
      switch (action as AIAction) {
        case 'brandDNA':
          const dnaResult = await analyzeBrandDNA({
            brandName: sanitizeInput(params.brandName || ''),
            industry: sanitizeInput(params.industry || ''),
            competitorBrands: (params.competitorBrands || []).map((b: string) =>
              sanitizeInput(b)
            ),
          })
          if (!dnaResult.success) error = dnaResult.error
          else result = dnaResult.data!
          break

        case 'analyzeBrand':
          const brandResult = await analyzeBrand({
            brandName: sanitizeInput(params.brandName || ''),
            industry: sanitizeInput(params.industry || ''),
          })
          if (!brandResult.success) error = brandResult.error
          else result = brandResult.data!
          break

        case 'generateIdeas':
          const ideasResult = await generateCreativeIdeas({
            brandName: sanitizeInput(params.brandName || ''),
            industry: sanitizeInput(params.industry || ''),
            programType: sanitizeInput(params.programType || ''),
            targetAudience: params.targetAudience
              ? sanitizeInput(params.targetAudience)
              : undefined,
            budget: params.budget ? sanitizeInput(params.budget) : undefined,
          })
          if (!ideasResult.success) error = ideasResult.error
          else result = ideasResult.data!
          break

        case 'generateProposal':
          const proposalResult = await generateProposalContent({
            brandName: sanitizeInput(params.brandName || ''),
            programName: sanitizeInput(params.programName || ''),
            objective: sanitizeInput(params.objective || ''),
            keyMessages: (params.keyMessages || []).map((m: string) =>
              sanitizeInput(m)
            ),
            budget: params.budget ? sanitizeInput(params.budget) : undefined,
          })
          if (!proposalResult.success) error = proposalResult.error
          else result = proposalResult.data!
          break

        case 'searchReference':
          const refResult = await searchReference({
            topic: sanitizeInput(params.topic || ''),
            industry: params.industry
              ? sanitizeInput(params.industry)
              : undefined,
          })
          if (!refResult.success) error = refResult.error
          else result = refResult.data!
          break

        case 'improveText':
          const textResult = await improveText({
            text: sanitizeInput(params.text || ''),
            type: params.type ? sanitizeInput(params.type) : undefined,
          })
          if (!textResult.success) error = textResult.error
          else result = textResult.data!
          break

        case 'trendAnalysis':
          const trendResult = await trendAnalysis({
            industry: params.industry ? sanitizeInput(params.industry) : undefined,
            category: params.category
              ? sanitizeInput(params.category)
              : undefined,
          })
          if (!trendResult.success) error = trendResult.error
          else result = trendResult.data!
          break

        case 'audienceInsights':
          const audienceResult = await audienceInsights({
            industry: params.industry
              ? sanitizeInput(params.industry)
              : undefined,
            demographic: params.demographic
              ? sanitizeInput(params.demographic)
              : undefined,
          })
          if (!audienceResult.success) error = audienceResult.error
          else result = audienceResult.data!
          break

        case 'calculateROI':
          const roiResult = await calculateROI({
            budget: sanitizeInput(params.budget || ''),
            program: sanitizeInput(params.program || ''),
            expectedReach: params.expectedReach
              ? sanitizeInput(params.expectedReach)
              : undefined,
            duration: params.duration
              ? sanitizeInput(params.duration)
              : undefined,
          })
          if (!roiResult.success) error = roiResult.error
          else result = roiResult.data!
          break

        default:
          return NextResponse.json(
            { success: false, error: `Unknown action: ${action}` },
            { status: 400 }
          )
      }
    } catch (aiError: any) {
      console.error('AI processing error:', aiError)
      error = aiError.message || 'Failed to process AI request'
    }

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      )
    }

    const headers = getRateLimitHeaders(
      rateLimitResult.remaining,
      rateLimitResult.resetAt,
      rateLimitResult.isDistributed
    )

    return NextResponse.json({ success: true, data: result }, { headers })
  } catch (error: any) {
    console.error('AI API route error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process AI request' },
      { status: 500 }
    )
  }
}
