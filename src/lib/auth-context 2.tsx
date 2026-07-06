"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "./types"
import { createClient } from "./supabase/client"

type UserType = 'demo' | 'new' | 'existing'

interface AuthContextType {
  user: User | null
  userType: UserType
  isLoading: boolean
  login: (type: UserType, email?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: Record<string, User> = {
  demo: {
    id: "demo-1",
    name: "Demo User",
    email: "demo@pitchflow.app",
    role: "Supervisor",
  },
  new: {
    id: "new-1",
    name: "New User",
    email: "newuser@pitchflow.app",
    role: "Sales",
  },
  existing: {
    id: "user-1",
    name: "Fajar Pahlawan H.",
    email: "fajar.p@rectoverso.com",
    role: "Supervisor",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType>('demo')
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("pitchflow_user")
      const savedType = localStorage.getItem("pitchflow_user_type") as UserType | null

      if (savedUser && savedType) {
        setUser(JSON.parse(savedUser))
        setUserType(savedType)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (type: UserType, email?: string) => {
    setIsLoading(true)

    try {
      if (type === 'demo') {
        // Demo mode - use mock data
        const demoUser = { ...demoUsers.demo }
        setUser(demoUser)
        setUserType('demo')
        if (typeof window !== "undefined") {
          localStorage.setItem("pitchflow_user", JSON.stringify(demoUser))
          localStorage.setItem("pitchflow_user_type", 'demo')
        }
      } else if (type === 'new') {
        // New user - create empty session
        const newUser = {
          ...demoUsers.new,
          email: email || "newuser@pitchflow.app",
        }
        setUser(newUser)
        setUserType('new')
        if (typeof window !== "undefined") {
          localStorage.setItem("pitchflow_user", JSON.stringify(newUser))
          localStorage.setItem("pitchflow_user_type", 'new')
        }
      } else if (type === 'existing') {
        // Existing user - fetch from Supabase
        const supabase = createClient()

        if (email) {
          // Login with email - check if user exists
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

          if (error || !data) {
            // User not found - use demo data for now
            const existingUser = {
              ...demoUsers.existing,
              email: email,
            }
            setUser(existingUser)
            setUserType('existing')
            if (typeof window !== "undefined") {
              localStorage.setItem("pitchflow_user", JSON.stringify(existingUser))
              localStorage.setItem("pitchflow_user_type", 'existing')
            }
          } else {
            const existingUser: User = {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
              avatar: data.avatar_url,
            }
            setUser(existingUser)
            setUserType('existing')
            if (typeof window !== "undefined") {
              localStorage.setItem("pitchflow_user", JSON.stringify(existingUser))
              localStorage.setItem("pitchflow_user_type", 'existing')
            }
          }
        } else {
          // Use default existing user
          setUser(demoUsers.existing)
          setUserType('existing')
          if (typeof window !== "undefined") {
            localStorage.setItem("pitchflow_user", JSON.stringify(demoUsers.existing))
            localStorage.setItem("pitchflow_user_type", 'existing')
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      // Fallback to demo mode
      setUser(demoUsers.demo)
      setUserType('demo')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setUserType('demo')
    if (typeof window !== "undefined") {
      localStorage.removeItem("pitchflow_user")
      localStorage.removeItem("pitchflow_user_type")
    }
  }

  return (
    <AuthContext.Provider value={{ user, userType, isLoading, login, logout }}>
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
