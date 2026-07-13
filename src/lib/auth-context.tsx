"use client"

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { User } from "@/lib/types"

// User type constants
export type UserType = 'new' | 'existing' | 'demo'

// Demo users data
const demoUsers: Record<UserType, User | null> = {
  demo: {
    id: "demo-1",
    name: "Demo User",
    email: "demo@pitchflow.app",
    role: "Supervisor",
  },
  new: null,
  existing: null,
}

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  loginWithGoogle: () => void
  loginAsDemo: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType>('new')

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)

    // Check localStorage for saved user
    const savedUser = localStorage.getItem('pitchflow_user')
    const savedType = localStorage.getItem('pitchflow_user_type') as UserType | null

    if (savedUser && savedType) {
      try {
        setUser(JSON.parse(savedUser))
        setUserType(savedType)
      } catch (e) {
        console.error('Error parsing saved user:', e)
      }
    }
  }, [])

  const loginAsDemo = useCallback(() => {
    const demoUser = demoUsers.demo!
    setUser(demoUser)
    setUserType('demo')
    localStorage.setItem('pitchflow_user', JSON.stringify(demoUser))
    localStorage.setItem('pitchflow_user_type', 'demo')
    window.location.href = '/dashboard'
  }, [])

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/signin/google'
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setUserType('new')
    localStorage.removeItem('pitchflow_user')
    localStorage.removeItem('pitchflow_user_type')
    window.location.href = '/login'
  }, [])

  const value: AuthContextValue = {
    user: mounted ? user : null,
    userType: mounted ? userType : 'new',
    isLoading: !mounted,
    isAuthenticated: mounted && user !== null,
    logout,
    loginWithGoogle,
    loginAsDemo,
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
