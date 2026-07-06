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

export type UserType = 'demo' | 'new' | 'existing' | 'supervisor' | 'acs' | 'sales'

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

  // For demo mode, set userType to demo
  const isDemo = !session?.user && status !== "loading"

  const logout = async () => {
    const { signOut } = await import("next-auth/react")
    await signOut({ callbackUrl: "/login" })
  }

  return {
    user: isDemo ? {
      id: "demo-1",
      name: "Demo User",
      email: "demo@pitchflow.app",
      role: "Supervisor" as User["role"],
    } : user,
    userType: (isDemo ? "demo" : user?.role?.toLowerCase()) as UserType,
    isLoading: status === "loading",
    logout,
  }
}
