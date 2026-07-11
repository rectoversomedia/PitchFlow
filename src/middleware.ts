import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Protected routes that require authentication
const protectedPaths = [
  "/dashboard",
  "/brief-intake",
  "/proposal-builder",
  "/proposal-library",
  "/brand-idea-explorer",
  "/sales-review",
  "/analytics",
  "/calendar",
  "/client-crm",
  "/presentation",
  "/brand-dna-explorer",
  "/trend-radar",
  "/audience-insights",
  "/roi-calculator",
  "/campaign-studio",
]

// Public paths that don't require authentication
const publicPaths = [
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
  "/PitchFlow Logo (white).png",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================
  // Security Headers
  // ============================================
  const response = NextResponse.next()

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

  // X-Frame-Options - Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // X-Content-Type-Options - Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // X-XSS-Protection - Legacy XSS protection (modern browsers use CSP)
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Referrer-Policy - Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Permissions-Policy - Disable unnecessary browser features
  response.headers.set(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
    ].join(", ")
  )

  // Strict-Transport-Security - Force HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }

  // ============================================
  // Allow public paths
  // ============================================
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return response
  }

  // Allow NextAuth routes
  if (pathname.startsWith("/api/auth")) {
    return response
  }

  // Allow static files
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.includes(".")
  ) {
    return response
  }

  // Redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtectedPath) {
    // Get the session token using NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    })

    if (!token) {
      // Redirect to login with callback URL
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
