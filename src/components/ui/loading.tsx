"use client"

import { Loader2 } from "lucide-react"

export function LoadingPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
      {children && <p className="text-slate-600">{children}</p>}
    </div>
  )
}
