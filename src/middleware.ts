import { NextResponse, type NextRequest } from 'next/server'

// Public paths that don't require any auth check
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // For now, allow all access - auth is handled client-side
  // TODO: Add proper server-side auth check if needed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
