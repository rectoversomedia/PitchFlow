"use client"

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { useSession, signOut as nextAuthSignOut, signIn as nextAuthSignIn } from "next-auth/react"
import { User } from "@/lib/types"

// User type constants
export type UserType = 'new' | 'existing'

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession()
  const [userType, setUserType] = useState<UserType>('new')
  const [mounted, setMounted] = useState(false)

  // Set mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync session with state
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserType('existing')
    } else if (status === 'unauthenticated') {
      setUserType('new')
    }
  }, [status, session])

  // Convert session user to User type
  const user: User | null = session?.user ? {
    id: session.user.id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as any).role || 'Sales',
    avatar: session.user.image || undefined,
  } : null

  const loginWithCredentials = useCallback(async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: 'Email atau password salah' }
      }

      window.location.href = '/dashboard'
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' }
    }
  }, [])

  const logout = useCallback(async () => {
    setUserType('new')
    await nextAuthSignOut({ callbackUrl: '/login' })
  }, [])

  const refreshUser = useCallback(async () => {
    await update()
  }, [update])

  const value: AuthContextValue = {
    user: mounted ? user : null,
    userType: mounted ? userType : 'new',
    isLoading: !mounted || status === 'loading',
    isAuthenticated: mounted && user !== null,
    logout,
    loginWithCredentials,
    refreshUser,
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
