/**
 * CSRF Protection Middleware for PitchFlow
 *
 * Implements double-submit cookie pattern to prevent Cross-Site Request Forgery attacks.
 */

import { NextRequest, NextResponse } from 'next/server'

// CSRF Cookie and Header names
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

// Generate a random CSRF token
function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Create a CSRF token response
 * Sets the token as both a cookie and returns it in the response body
 */
export function createCSRFToken(): { token: string; response: NextResponse } {
  const token = generateCSRFToken()

  const response = NextResponse.json({
    success: true,
    csrfToken: token,
  })

  // Set the token as an HTTP-only cookie
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { token, response }
}

/**
 * Validate CSRF token from request
 * Uses the double-submit cookie pattern
 */
export function validateCSRFToken(request: NextRequest): boolean {
  // Only validate for mutating methods
  if (!CSRF_METHODS.includes(request.method)) {
    return true
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  // Both tokens must be present
  if (!cookieToken || !headerToken) {
    console.warn('[CSRF] Missing token:', { hasCookie: !!cookieToken, hasHeader: !!headerToken })
    return false
  }

  // Tokens must match (constant-time comparison to prevent timing attacks)
  if (!timingSafeEqual(cookieToken, headerToken)) {
    console.warn('[CSRF] Token mismatch')
    return false
  }

  return true
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * CSRF protection wrapper for API routes
 * Returns an error response if CSRF validation fails
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip CSRF check for GET, HEAD, OPTIONS
    if (!CSRF_METHODS.includes(request.method)) {
      return handler(request)
    }

    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSRF validation failed. Please refresh the page and try again.',
          code: 'CSRF_INVALID',
        },
        { status: 403 }
      )
    }

    return handler(request)
  }
}

/**
 * CSRF protection middleware for pages
 * Redirects to error page if CSRF validation fails
 */
export function requireCSRF(request: NextRequest): NextResponse | null {
  if (!CSRF_METHODS.includes(request.method)) {
    return null
  }

  if (!validateCSRFToken(request)) {
    console.warn('[CSRF] Blocked request from:', request.headers.get('origin'))
    return NextResponse.json(
      {
        success: false,
        error: 'CSRF validation failed. This request was blocked for security.',
        code: 'CSRF_INVALID',
      },
      { status: 403 }
    )
  }

  return null
}

/**
 * Get CSRF token endpoint handler
 * GET /api/csrf - Returns a new CSRF token
 */
export async function GET(): Promise<NextResponse> {
  return createCSRFToken().response
}
