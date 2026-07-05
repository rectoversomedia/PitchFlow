"use client"

import { signIn, useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const [googleError, setGoogleError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError("Email atau password salah")
        setIsLoading(false)
      }
    } catch {
      setError("Terjadi kesalahan")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setGoogleError("")

    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google login error:", error)
      setGoogleError("Google OAuth belum dikonfigurasi. Gunakan 'Try Demo' untuk mencoba aplikasi.")
      setIsGoogleLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)

    // Demo login - set mock session and redirect
    try {
      // Create demo session storage
      const demoUser = {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@pitchflow.app",
        role: "Supervisor"
      }

      // Store in localStorage for demo purposes
      if (typeof window !== 'undefined') {
        localStorage.setItem('pitchflow_demo_user', JSON.stringify(demoUser))
        localStorage.setItem('pitchflow_is_demo', 'true')
      }

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500))

      router.push('/dashboard')
    } catch (error) {
      console.error("Demo login error:", error)
      setIsDemoLoading(false)
    }
  }

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
        <div style={{ width: '100%', maxWidth: 420 }}>
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
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Selamat datang!</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
                    <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="nama@rectoverso.com"
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
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
                    <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: 48,
                      paddingLeft: 48,
                      paddingRight: 48,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      fontSize: 14,
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1
                    }}
                  >
                    {showPassword ? (
                      <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8-11-8-11-8-11-8-11-8-11-8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
                <Link href="/forgot-password" style={{ fontSize: 14, color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                  Lupa password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: 48,
                  background: isLoading ? '#1d4ed8' : '#2563eb',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 12,
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 14,
                  transition: 'all 0.2s',
                  marginTop: 8,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: 'relative', padding: '12px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e2e8f0' }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span style={{ background: 'white', padding: '0 16px', fontSize: 12, color: '#94a3b8' }}>atau</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              style={{
                width: '100%',
                height: 48,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: 500,
                color: '#334155',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                opacity: isGoogleLoading ? 0.6 : 1
              }}
            >
              {isGoogleLoading ? (
                <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isGoogleLoading ? 'Memproses...' : 'Masuk dengan Google'}
            </button>

            {/* Google Error Message */}
            {googleError && (
              <div style={{
                padding: '10px 12px',
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: 8,
                marginTop: 12,
                fontSize: 12,
                color: '#92400e',
                textAlign: 'center'
              }}>
                {googleError}
              </div>
            )}

            {/* Try Demo Button - GREEN */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              style={{
                width: '100%',
                height: 48,
                background: isDemoLoading ? '#15803d' : '#16a34a',
                border: 'none',
                borderRadius: 12,
                cursor: isDemoLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                transition: 'all 0.2s',
                marginTop: 16,
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isDemoLoading) {
                  e.currentTarget.style.backgroundColor = '#15803d'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDemoLoading) {
                  e.currentTarget.style.backgroundColor = '#16a34a'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {isDemoLoading ? (
                <>
                  <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memuat Demo...
                </>
              ) : (
                <>
                  <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Try Demo
                </>
              )}
            </button>

            {/* Demo Info */}
            <div style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 11,
              color: '#94a3b8'
            }}>
              Demo menggunakan data sample untuk coba aplikasi tanpa login
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
            © 2026 Rectoverso. Semua hak dilindungi.
          </p>

          {/* Sign Up Link */}
          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 16 }}>
            Belum punya akun?{' '}
            <Link href="/signup" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
              Daftar sekarang
            </Link>
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
