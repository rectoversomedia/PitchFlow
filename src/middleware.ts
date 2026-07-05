import { NextResponse, type NextRequest } from "next/server"

// Simplified middleware - allow all paths for now
// Auth will be configured later

export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
