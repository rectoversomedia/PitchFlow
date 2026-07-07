"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const router = useRouter()
  
  const inviteEmail = ""

  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [formData, setFormData] = useState({
    name: "",
    email: inviteEmail || "",
    role: "ACS",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  })
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    if (!formData.agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan")
      return
    }

    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      setStep('verify')
    }, 1500)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate verification
    setTimeout(() => {
      if (code === "123456" || code.length === 6) {
        setIsLoading(false)
        router.push("/login?signup=success")
      } else {
        setIsLoading(false)
        setError("Kode verifikasi tidak valid. Gunakan 123456 untuk demo.")
      }
    }, 1500)
  }

  const roles = [
    { value: "ACS", label: "ACS (Account Executive)" },
    { value: "Sales", label: "Sales" },
    { value: "Supervisor", label: "Supervisor" }
  ]

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
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, background: '#2563eb', borderRadius: '50%', opacity: 0.2, filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, background: '#7c3aed', borderRadius: '50%', opacity: 0.15, filter: 'blur(100px)' }} />
        </div>

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 64px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image src="/PitchFlow Logo (white).png" alt="PitchFlow" width={140} height={40} style={{ objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Bergabung<br />Sekarang!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: 18, maxWidth: 400, lineHeight: 1.6 }}>
                Mulai buat proposal sponsorship yang lebih profesional dan efisien bersama tim Anda.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: "Gratis untuk Tim", desc: "Mulai tanpa biaya awal" },
                { title: "AI-powered", desc: "Buat proposal lebih cepat" },
                { title: "Kolaborasi Tim", desc: "Working sama lebih mudah" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 500, display: 'block' }}>{item.title}</span>
                    <span style={{ color: '#94a3b8', fontSize: 12, display: 'block' }}>{item.desc}</span>
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

      {/* Right Side */}
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

          {/* Card */}
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }}>
            {/* Back to Login */}
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, textDecoration: 'none', color: '#64748b', fontSize: 14 }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Kembali ke Login
            </Link>

            {step === 'form' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Daftar Akun Baru</h2>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Buat akun untuk mulai menggunakan PitchFlow</p>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#2563eb' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Nama */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, pointerEvents: 'none' }}>
                        <svg style={{ width: 20, height: 20, color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <input
                        type="email"
                        placeholder="nama@rectoverso.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', height: 48, paddingLeft: 48, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Role / Jabatan</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Password */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Password</label>
                    <input
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Konfirmasi Password</label>
                    <input
                      type="password"
                      placeholder="Masukkan password lagi"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      required
                    />
                  </div>

                  {/* Terms */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer', accentColor: '#2563eb' }}
                    />
                    <label htmlFor="terms" style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, cursor: 'pointer' }}>
                      Saya setuju dengan <span style={{ color: '#2563eb', fontWeight: 500 }}>Syarat dan Ketentuan</span> serta <span style={{ color: '#2563eb', fontWeight: 500 }}>Kebijakan Privasi</span> PitchFlow
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: '100%', height: 48, background: isLoading ? '#b91c1c' : '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, transition: 'all 0.2s', marginTop: 8, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
                  >
                    {isLoading ? (
                      <>
                        <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Mendaftar...
                      </>
                    ) : "Daftar Akun"}
                  </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 24 }}>
                  Sudah punya akun?{' '}
                  <Link href="/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                    Masuk
                  </Link>
                </p>
              </>
            )}

            {step === 'verify' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Verifikasi Email</h2>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Kami telah mengirim kode verifikasi ke</p>
                  <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 500, marginTop: 4 }}>{formData.email}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>(Demo: gunakan kode <span style={{ color: '#2563eb', fontWeight: 600 }}>123456</span>)</p>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#2563eb' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Kode Verifikasi</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={code[i] || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val.match(/^[0-9]$/) || val === '') {
                              const newCode = code.split('')
                              newCode[i] = val
                              setCode(newCode.join(''))
                              if (val && i < 5) {
                                const nextInput = document.querySelector(`input[name="code-${i + 1}"]`) as HTMLInputElement
                                nextInput?.focus()
                              }
                            }
                          }}
                          name={`code-${i}`}
                          style={{ width: 48, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: 12, outline: 'none', boxSizing: 'border-box' }}
                          onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                          onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || code.length < 6}
                    style={{ width: '100%', height: 48, background: isLoading || code.length < 6 ? '#fca5a5' : '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: isLoading || code.length < 6 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, transition: 'all 0.2s', boxShadow: code.length >= 6 ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none' }}
                  >
                    {isLoading ? "Memverifikasi..." : "Verifikasi Email"}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
                    Tidak menerima kode?
                    <button type="button" onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 500, cursor: 'pointer', marginLeft: 4 }}>
                      Kirim Ulang
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>
            © 2026 Rectoverso. Semua hak dilindungi.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
