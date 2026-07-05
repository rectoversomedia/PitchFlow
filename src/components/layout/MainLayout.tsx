"use client"

import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px' }}>
        <Header />
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
