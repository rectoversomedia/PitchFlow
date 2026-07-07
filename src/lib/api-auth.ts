import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export type AuthenticatedUser = {
  id: string
  email: string
  name?: string | null
  role?: string
  avatar_url?: string | null
}

/**
 * Require authentication - returns user or NextResponse error
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | NextResponse> {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - Please login" },
      { status: 401 }
    )
  }

  return {
    id: session.user.id || (session.user as any).id,
    email: session.user.email || "",
    name: session.user.name,
    role: (session.user as any).role || "Sales",
    avatar_url: (session.user as any).avatar_url || session.user.image,
  }
}

/**
 * Optional auth - returns user or null
 */
export async function getOptionalAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id || (session.user as any).id,
    email: session.user.email || "",
    name: session.user.name,
    role: (session.user as any).role || "Sales",
    avatar_url: (session.user as any).avatar_url || session.user.image,
  }
}

/**
 * Get Supabase client with authenticated user
 */
export async function getAuthenticatedClient(request: NextRequest) {
  const user = await requireAuth(request)
  if (user instanceof NextResponse) {
    return { user: null, supabase: null, error: user }
  }

  const supabase = await createServerClient()
  return { user, supabase, error: null }
}
