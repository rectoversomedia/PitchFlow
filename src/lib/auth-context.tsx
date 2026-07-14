"use client"

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { useSession, signOut as nextAuthSignOut, signIn as nextAuthSignIn } from "next-auth/react"
import { User } from "@/lib/types"

// User type constants
export type UserType = 'new' | 'existing' | 'demo'

// Demo user for testing
const demoUser: User = {
  id: "demo-1",
  name: "Demo User",
  email: "demo@pitchflow.app",
  role: "Supervisor",
}

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  isAuthenticated: boolean
  isDemo: boolean
  logout: () => void
  loginWithGoogle: () => void
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginAsDemo: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use NextAuth session as the source of truth
  const { data: session, status, update } = useSession()
  const [userType, setUserType] = useState<UserType>('new')
  const [isDemo, setIsDemo] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load demo mode from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedType = localStorage.getItem('pitchflow_user_type') as UserType | null
    if (savedType === 'demo') {
      setUserType('demo')
      setIsDemo(true)
    }
  }, [])

  // Sync session with state
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserType('existing')
      setIsDemo(false)
      // Clear demo mode if real login
      localStorage.removeItem('pitchflow_user_type')
    } else if (status === 'unauthenticated' && !isDemo) {
      setUserType('new')
    }
  }, [status, session, isDemo])

  // Convert session user to User type
  const user: User | null = isDemo ? demoUser : (session?.user ? {
    id: session.user.id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as any).role || 'Sales',
    avatar: session.user.image || undefined,
  } : null)

  const loginAsDemo = useCallback(() => {
    setUserType('demo')
    setIsDemo(true)
    localStorage.setItem('pitchflow_user_type', 'demo')
    window.location.href = '/dashboard'
  }, [])

  const loginWithGoogle = useCallback(() => {
    nextAuthSignIn('google', { callbackUrl: '/dashboard' })
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: 'Email atau password salah' }
      }

      // Refresh the page to get the session
      window.location.href = '/dashboard'
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' }
    }
  }, [])

  const logout = useCallback(async () => {
    // Clear demo mode
    setUserType('new')
    setIsDemo(false)
    localStorage.removeItem('pitchflow_user_type')

    // Sign out from NextAuth if logged in
    if (status === 'authenticated') {
      await nextAuthSignOut({ callbackUrl: '/login' })
    } else {
      window.location.href = '/login'
    }
  }, [status])

  const refreshUser = useCallback(async () => {
    await update()
  }, [update])

  const value: AuthContextValue = {
    user: mounted ? user : null,
    userType: mounted ? userType : 'new',
    isLoading: !mounted || status === 'loading',
    isAuthenticated: mounted && (user !== null || isDemo),
    isDemo: mounted && isDemo,
    logout,
    loginWithGoogle,
    loginWithEmail,
    loginAsDemo,
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
