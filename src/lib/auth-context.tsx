"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/lib/types"

export type UserType = 'demo' | 'new' | 'existing'

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  logout: () => void
  loginAsDemo: () => void
  loginWithGoogle: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Demo user data
const demoUser: User = {
  id: "demo-1",
  name: "Demo User",
  email: "demo@pitchflow.app",
  role: "Supervisor",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType>('new')
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Check localStorage for demo mode
    const isDemo = localStorage.getItem('pitchflow_demo_mode') === 'true'
    const storedUser = localStorage.getItem('pitchflow_user')

    if (isDemo) {
      setUser(demoUser)
      setUserType('demo')
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setUserType('existing')
      } catch (e) {
        console.error('Error parsing stored user:', e)
      }
    } else {
      setUser(null)
      setUserType('new')
    }

    setIsLoading(false)
  }, [])

  const loginAsDemo = () => {
    localStorage.setItem('pitchflow_demo_mode', 'true')
    localStorage.removeItem('pitchflow_user')
    // Set cookie for middleware
    document.cookie = 'pitchflow_demo=true; path=/; max-age=86400'
    setUser(demoUser)
    setUserType('demo')
  }

  const loginWithGoogle = (googleUser?: User) => {
    // Clear demo mode
    localStorage.removeItem('pitchflow_demo_mode')

    if (googleUser) {
      localStorage.setItem('pitchflow_user', JSON.stringify(googleUser))
      setUser(googleUser)
      setUserType('existing')
    }
  }

  const logout = () => {
    localStorage.removeItem('pitchflow_demo_mode')
    localStorage.removeItem('pitchflow_user')
    // Clear cookie
    document.cookie = 'pitchflow_demo=; path=/; max-age=0'
    setUser(null)
    setUserType('new')
    // Redirect to login
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isLoading,
      logout,
      loginAsDemo,
      loginWithGoogle,
      isAuthenticated: user !== null || userType === 'demo'
    }}>
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
