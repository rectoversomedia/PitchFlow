import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't need authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/api/ai",
    "/api/csrf",
    "/api/health",
    "/_next",
    "/favicon.ico",
    "/public",
  ]

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    const response = NextResponse.next()
    addSecurityHeaders(response)
    return response
  }

  // Allow static files
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const session = await auth()

  // Routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/brief-intake",
    "/proposal-builder",
    "/proposal-library",
    "/client-crm",
    "/calendar",
    "/sales-review",
    "/brand-idea-explorer",
    "/brand-dna-explorer",
    "/campaign-studio",
    "/trend-radar",
    "/audience-insights",
    "/roi-calculator",
    "/analytics",
    "/presentation",
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !session?.user) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.next()
  addSecurityHeaders(response)
  return response
}

function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ")
  )

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
