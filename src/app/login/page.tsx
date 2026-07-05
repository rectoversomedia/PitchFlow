"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { UserType } from "@/lib/auth-utils"

type UserType = 'demo' | 'new' | 'existing'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [selectedType, setSelectedType] = useState<UserType>('demo')
  const [email, setEmail] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")
  const [googleError, setGoogleError] = useState("")

  const handleLogin = async () => {
    setIsLoggingIn(true)
    setError("")

    try {
      await login(selectedType, email || undefined)
      router.push('/dashboard')
    } catch (err) {
      setError("Login gagal. Silakan coba lagi.")
      console.error('Login error:', err)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const userTypes = [
    {
      id: 'demo' as UserType,
      label: 'Demo User',
      desc: 'Data sample untuk percobaan',
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.1)',
      border: '#16a34a',
    },
    {
      id: 'new' as UserType,
      label: 'New User',
      desc: 'Workspace kosong baru',
      color: '#2563eb',
      bg: 'rgba(37, 99, 235, 0.1)',
      border: '#2563eb',
    },
    {
      id: 'existing' as UserType,
      label: 'Existing User',
      desc: 'Data real dari database',
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.1)',
      border: '#7c3aed',
    },
  ]

  const currentType = userTypes.find(t => t.id === selectedType)!

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Branding */}
      <div
        style={{
          display: 'none',
          width: '50%',
          position: 'relative',
          background: 'linear-gradient(135deg, #061A3A 0%, #0f172a 50%, #1e1b4b 100%)',
          overflow: 'hidden'
        }}
        className="lg:flex"
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, background: '#2563eb', borderRadius: '50%', opacity: 0.2, filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, background: '#7c3aed', borderRadius: '50%', opacity: 0.15, filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '60%', width: 400, height: 400, background: '#2563eb', borderRadius: '50%', opacity: 0.1, filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image src="/picthflow logo (white).png" alt="PitchFlow" width={140} height={40} style={{ objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Sponsorship<br />
                Proposal<br />
                Workspace
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: 18, maxWidth: 400, lineHeight: 1.6 }}>
                From brief to powerful proposal, smarter & faster with AI.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: "Brief Terstruktur", desc: "Kelola brief dengan rapi & terorganisir" },
                { title: "AI Proposal Builder", desc: "Buat proposal lebih cepat dengan AI" },
                { title: "Kolaborasi dengan Sales", desc: "Feedback & komunikasi satu platform" }
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 500, display: 'block' }}>{feature.title}</span>
                    <span style={{ color: '#94a3b8', fontSize: 12, display: 'block' }}>{feature.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ color: '#64748b', fontSize: 12 }}>
            © 2026 Rectoverso. All rights reserved.
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)', pointerEvents: 'none' }} />
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)'
        }}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            <Image src="/pitchflow logo (normal).png" alt="PitchFlow" width={180} height={50} style={{ objectFit: 'contain' }} />
          </div>

          {/* Login Card */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            padding: 32,
            border: '1px solid #f1f5f9'
          }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Selamat datang!</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Pilih tipe user untuk melanjutkan</p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* User Type Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 10 }}>
                Pilih Tipe User
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: 12,
                      border: selectedType === type.id ? `2px solid ${type.border}` : '2px solid #e2e8f0',
                      background: selectedType === type.id ? type.bg : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: selectedType === type.id ? type.color : '#64748b',
                      marginBottom: 4
                    }}>
                      {type.label}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field (for existing user) */}
            {selectedType === 'existing' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
                  Email (opsional)
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
                    <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="email@rectoverso.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: 48,
                      paddingLeft: 48,
                      paddingRight: 16,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      fontSize: 14,
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Info Box */}
            <div style={{
              padding: '12px 16px',
              background: currentType.bg,
              border: `1px solid ${currentType.border}40`,
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                {selectedType === 'demo' && 'Demo menggunakan data sample untuk coba aplikasi tanpa login. Cocok untuk preview fitur.'}
                {selectedType === 'new' && 'New user akan mulai dengan workspace kosong. Data akan tersimpan saat Anda membuat brief/proposal.'}
                {selectedType === 'existing' && 'Login dengan data real dari database Supabase. Hubungi admin jika belum punya akun.'}
              </p>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn || isLoading}
              style={{
                width: '100%',
                height: 52,
                background: isLoggingIn ? currentType.color : currentType.color,
                color: 'white',
                fontWeight: 600,
                borderRadius: 12,
                border: 'none',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 15,
                transition: 'all 0.2s',
                boxShadow: `0 4px 12px ${currentType.color}30`
              }}
              onMouseEnter={(e) => {
                if (!isLoggingIn) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = `0 6px 16px ${currentType.color}40`
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoggingIn) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 4px 12px ${currentType.color}30`
                }
              }}
            >
              {isLoggingIn ? (
                <>
                  <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memuat...
                </>
              ) : (
                <>
                  {selectedType === 'demo' && (
                    <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                  {selectedType === 'new' && (
                    <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  )}
                  {selectedType === 'existing' && (
                    <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                    </svg>
                  )}
                  {selectedType === 'demo' && 'Try Demo'}
                  {selectedType === 'new' && 'Start New Workspace'}
                  {selectedType === 'existing' && 'Login as Existing'}
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
            © 2026 Rectoverso. Semua hak dilindungi.
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
