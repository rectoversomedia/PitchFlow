import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedPaths = [
  '/dashboard',
  '/brief-intake',
  '/proposal-builder',
  '/proposal-library',
  '/brand-idea-explorer',
  '/sales-review',
  '/analytics',
  '/calendar',
  '/client-crm',
  '/presentation',
  '/brand-dna-explorer',
  '/trend-radar',
  '/audience-insights',
  '/roi-calculator',
  '/campaign-studio',
]

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/api/ai',
  '/api/briefs',
  '/api/proposals',
  '/api/clients',
  '/api/events',
  '/api/sales-comments',
  '/_next',
  '/favicon.ico',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (!isProtectedPath) {
    // Redirect root to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // For now, allow all access (auth will be configured properly later)
  // TODO: Add proper auth check
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
