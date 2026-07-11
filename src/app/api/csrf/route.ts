import { NextResponse } from 'next/server'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Generate a random CSRF token
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * GET handler - Return CSRF token
 */
export async function GET(): Promise<NextResponse> {
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

  return response
}
