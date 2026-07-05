import { User } from "./types"

// User type constants
export type UserType = 'demo' | 'new' | 'existing'

// Demo users data
export const demoUsers = {
  demo: {
    id: "demo-1",
    name: "Demo User",
    email: "demo@pitchflow.app",
    role: "Supervisor" as const,
  },
  new: {
    id: "new-1",
    name: "New User",
    email: "newuser@pitchflow.app",
    role: "Sales" as const,
  },
  existing: {
    id: "user-1",
    name: "Fajar Pahlawan H.",
    email: "fajar.p@rectoverso.com",
    role: "Supervisor" as const,
  },
}

// Get user from localStorage (client-side)
export function getUserFromStorage(): { user: User | null; userType: UserType } {
  if (typeof window === "undefined") {
    return { user: null, userType: 'demo' }
  }

  const savedUser = localStorage.getItem("pitchflow_user")
  const savedType = localStorage.getItem("pitchflow_user_type") as UserType | null

  if (savedUser && savedType) {
    return {
      user: JSON.parse(savedUser),
      userType: savedType,
    }
  }

  return { user: null, userType: 'demo' }
}

// Save user to localStorage (client-side)
export function saveUserToStorage(user: User, userType: UserType): void {
  if (typeof window === "undefined") return

  localStorage.setItem("pitchflow_user", JSON.stringify(user))
  localStorage.setItem("pitchflow_user_type", userType)
}

// Clear user from localStorage (client-side)
export function clearUserFromStorage(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("pitchflow_user")
  localStorage.removeItem("pitchflow_user_type")
}

// Role permissions
export const rolePermissions = {
  Supervisor: {
    canEditAll: true,
    canViewAll: true,
    canApprove: true,
    canDelete: true,
    canExport: true,
  },
  ACS: {
    canEditAll: true,
    canViewAll: true,
    canApprove: false,
    canDelete: false,
    canExport: true,
  },
  Sales: {
    canEditAll: false,
    canViewAll: false,
    canApprove: false,
    canDelete: false,
    canExport: false,
  },
}

// Check if user has permission
export function hasPermission(role: string, permission: keyof typeof rolePermissions['Supervisor']): boolean {
  return rolePermissions[role as keyof typeof rolePermissions]?.[permission] ?? false
}

// Get user type display name
export function getUserTypeDisplayName(type: UserType): string {
  switch (type) {
    case 'demo':
      return 'Demo User'
    case 'new':
      return 'New User'
    case 'existing':
      return 'Existing User'
    default:
      return 'Unknown'
  }
}

// Get user type description
export function getUserTypeDescription(type: UserType): string {
  switch (type) {
    case 'demo':
      return 'Demo dengan data sample untuk percobaan'
    case 'new':
      return 'User baru dengan workspace kosong'
    case 'existing':
      return 'Login dengan data real dari database'
    default:
      return ''
  }
}
