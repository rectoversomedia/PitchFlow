"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react"
import { User } from "@/lib/types"

export type UserType = 'demo' | 'new' | 'existing'

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  logout: () => Promise<void>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [userType, setUserType] = useState<UserType>('new')
  const [isCheckingDb, setIsCheckingDb] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Check if user is a demo user
  const isDemoUser = (session?.user as any)?.isDemo === true ||
                     session?.user?.email === "demo@pitchflow.app" ||
                     isDemoMode

  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user.role as User["role"]) || "Sales",
        avatar: session.user.image || undefined,
      }
    : null

  // Check for demo mode from localStorage or session
  useEffect(() => {
    // Check localStorage for demo flag
    const storedDemo = localStorage.getItem('pitchflow_demo_mode')
    if (storedDemo === 'true') {
      setIsDemoMode(true)
    }
  }, [])

  // Determine user type based on authentication and data presence
  useEffect(() => {
    if (status === "loading") return

    // Demo user - always show mock data
    if (isDemoUser) {
      setUserType('demo')
      return
    }

    // Not logged in with Google
    if (!session?.user?.email) {
      setUserType('new')
      return
    }

    // Google user - check if they have data in Supabase
    async function checkUserData() {
      setIsCheckingDb(true)
      try {
        const response = await fetch(`/api/auth/check-user?email=${encodeURIComponent(session.user.email!)}`)
        const data = await response.json()

        if (data.hasData) {
          setUserType('existing')
        } else {
          setUserType('new')
        }
      } catch (error) {
        console.error('Error checking user data:', error)
        setUserType('new')
      } finally {
        setIsCheckingDb(false)
      }
    }

    checkUserData()
  }, [session?.user?.email, status, isDemoUser])

  const logout = async () => {
    // Clear demo mode
    localStorage.removeItem('pitchflow_demo_mode')

    const { signOut } = await import("next-auth/react")
    await signOut({ callbackUrl: "/login" })
  }

  return {
    user,
    userType,
    isLoading: status === "loading" || isCheckingDb,
    logout,
    setDemoMode: (value: boolean) => {
      setIsDemoMode(value)
      if (typeof window !== 'undefined') {
        localStorage.setItem('pitchflow_demo_mode', value.toString())
      }
    }
  }
}
