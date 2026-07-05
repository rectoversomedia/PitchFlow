import { NextRequest, NextResponse } from 'next/server'

// Backend API URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://31.97.106.177:3001'

// Rate limiting helper (simple client-side tracking)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000) {
  const now = Date.now()
  const key = ip
  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    entry = { count: 0, resetTime: now + windowMs }
    rateLimitStore.set(key, entry)
  }

  entry.count++
  return {
    success: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime
  }
}

// Forward request to backend
export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIP = forwardedFor?.split(',')[0]?.trim() || '127.0.0.1'

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP, 10, 60000)

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { action, params } = body

    // Forward to backend
    const backendUrl = `${BACKEND_URL}/api/ai/${getBackendEndpoint(action)}`

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Backend error' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      }
    })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend' },
      { status: 500 }
    )
  }
}

// Map frontend action to backend endpoint
function getBackendEndpoint(action: string): string {
  const mapping: Record<string, string> = {
    'generateIdeas': 'creative-ideas',
    'generateProposal': 'generate-proposal',
    'generateImage': 'generate-image',
    'generateImagePrompt': 'generate-image-prompt',
    'analyzeBrand': 'analyze-brand',
    'improveText': 'improve-text',
    'searchReference': 'search-reference',
    'brandDNA': 'brand-dna',
    'trendAnalysis': 'trend-analysis',
    'audienceInsights': 'audience-insights',
    'calculateROI': 'calculate-roi',
  }
  return mapping[action] || action
}
