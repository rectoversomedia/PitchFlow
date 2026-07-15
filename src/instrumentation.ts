/**
 * Global Error Handler
 *
 * Catches all unhandled errors and reports them to Sentry.
 */

import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

export default function onError(error: Error, context: { request?: Request }) {
  // Log to console
  console.error('[Global Error Handler]', error)

  // Report to Sentry
  Sentry.captureException(error)

  // Return generic error response
  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
