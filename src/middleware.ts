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
  "/_next",
  "/favicon.ico",
  "/PitchFlow Logo (white).png",
]

export async function middleware(request: NextRequest) {
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
