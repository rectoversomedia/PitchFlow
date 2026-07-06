"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { ReactNode } from "react"
import { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user.role as User["role"]) || "Sales",
        avatar: session.user.image || undefined,
      }
    : null

  const logout = async () => {
    const { signOut } = await import("next-auth/react")
    await signOut({ callbackUrl: "/login" })
  }

  return {
    user,
    userType: user?.role?.toLowerCase() as "supervisor" | "acs" | "sales" | undefined,
    isLoading: status === "loading",
    logout,
  }
}
