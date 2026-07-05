import { NextResponse, type NextRequest } from "next-server"
import { auth } from "@/app/api/auth/[...nextauth]/route"

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
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (!isProtectedPath) {
    // Redirect root to dashboard or login
    if (pathname === "/") {
      const session = await auth()
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  // Check authentication for protected paths
  const session = await auth()

  if (!session) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
