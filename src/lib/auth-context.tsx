"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { User } from "@/lib/types"

export type UserType = 'new' | 'existing'

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  // Convert NextAuth session to our User type
  const user: User | null = session?.user ? {
    id: (session.user as any).id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as any).role || 'Sales',
    avatar: session.user.image || undefined,
  } : null

  const value: AuthContextValue = {
    user,
    userType: user ? 'existing' : 'new',
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated' && !!user,
    logout,
    loginWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
