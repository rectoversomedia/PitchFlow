import { NextResponse, type NextRequest } from "next/server"

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
  "/api/briefs",
  "/api/proposals",
  "/api/clients",
  "/api/events",
  "/api/sales-comments",
  "/_next",
  "/favicon.ico",
  "/picthflow logo (white).png",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow NextAuth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Allow static files
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isProtectedPath) {
    // Check for demo mode cookie or localStorage flag via header
    const isDemo = request.cookies.get('pitchflow_demo')?.value === 'true'

    if (!isDemo) {
      // Redirect to login with callback URL
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
