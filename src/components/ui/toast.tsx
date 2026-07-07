"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
}

interface ToastContextValue {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastViewport() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ id, title, description, variant = "default", onClose }: ToastProps & { onClose: () => void }) {
  const variantStyles = {
    default: "bg-slate-900 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-amber-600 text-white",
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full",
        variantStyles[variant]
      )}
      role="alert"
    >
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Convenience functions
export const toast = {
  default: (props: Omit<ToastProps, "id">) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { ...props, variant: "default" } }))
    }
  },
  success: (props: Omit<ToastProps, "id">) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { ...props, variant: "success" } }))
    }
  },
  error: (props: Omit<ToastProps, "id">) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { ...props, variant: "error" } }))
    }
  },
  warning: (props: Omit<ToastProps, "id">) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toast", { detail: { ...props, variant: "warning" } }))
    }
  },
}
