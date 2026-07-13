import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { User } from "@/lib/types"
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage, demoUsers } from "@/lib/auth-utils"

export type UserType = 'new' | 'existing' | 'demo'

interface AuthContextValue {
  user: User | null
  userType: UserType
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginAsDemo: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [userType, setUserType] = useState<UserType>('new')
  const [storedUser, setStoredUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const { user, userType: type } = getUserFromStorage()
    if (user && type) {
      setStoredUser(user)
      setUserType(type)
    }
  }, [])

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const loginAsDemo = () => {
    const demoUser = demoUsers.demo as User
    setStoredUser(demoUser)
    setUserType('demo')
    saveUserToStorage(demoUser, 'demo')
  }

  const logout = async () => {
    clearUserFromStorage()
    setStoredUser(null)
    setUserType('new')
    await signOut({ callbackUrl: "/login" })
  }

  // Use session user if authenticated, otherwise use stored user
  const user: User | null = session?.user ? {
    id: (session.user as any).id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as any).role || 'Sales',
    avatar: session.user.image || undefined,
  } : storedUser

  // Only access session after mount (client-side only)
  useEffect(() => {
    if (session?.user) {
      setUserType('existing')
      setStoredUser({
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any).role || 'Sales',
        avatar: session.user.image,
      })
    }
  }, [session])

  const value: AuthContextValue = {
    user: mounted ? (session?.user ? {
      id: (session.user as any).id || '',
      name: session.user.name || '',
      email: session.user.email || '',
      role: (session.user as any).role || 'Sales',
      avatar: session.user.image || undefined,
    } : storedUser) : null,
    userType: session?.user ? 'existing' : userType,
    isLoading: !mounted || status === 'loading',
    isAuthenticated: (session?.user !== null || storedUser !== null) && mounted,
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
