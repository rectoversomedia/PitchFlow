"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email')
  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(60)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      setIsLoading(false)
      setStep('verify')
      setTimer(60)
    }, 1500)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode === "123456" || fullCode.length === 6) {
      setStep('reset')
    } else {
      setError("Kode verifikasi tidak valid. Gunakan 123456 untuk demo.")
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/login?reset=success")
    }, 1500)
  }

  const resendCode = () => {
    setTimer(60)
    setCode(["", "", "", "", "", ""])
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.match(/^[0-9]$/)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      if (index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Branding */}
      <div style={{ display: 'none', width: '50%', position: 'relative', background: 'linear-gradient(135deg, #061A3A 0%, #0f172a 50%, #1e1b4b 100%)', overflow: 'hidden' }} className="lg:flex">
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
        </div>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image src="/PitchFlow Logo (white).png" alt="PitchFlow" width={140} height={40} style={{ objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 48, lineHeight: 1.1 }}>
                Lupa<br />Password?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: 18, maxWidth: 400 }}>
                Tenang, kami akan bantu Anda mengembalikan akses akun dengan mudah dan aman.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: "Verifikasi Email", desc: "Kami kirim kode ke email Anda" },
                { title: "Reset Password", desc: "Buat password baru yang aman" },
                { title: "Login Kembali", desc: "Akses akun Anda seperti biasa" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                    {i + 1}
                  </div>
                  <div>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 500, display: 'block' }}>{item.title}</span>
                    <span style={{ color: '#94a3b8', fontSize: 12, display: 'block' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ color: '#64748b', fontSize: 12 }}>© 2026 Rectoverso. All rights reserved.</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)', pointerEvents: 'none' }} />
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            <Image src="/pitchflow logo (normal).png" alt="PitchFlow" width={180} height={50} style={{ objectFit: 'contain' }} />
          </div>

          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }}>
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, textDecoration: 'none', color: '#64748b', fontSize: 14 }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Kembali ke Login
            </Link>

            {step === 'email' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Lupa Password?</h2>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Masukkan email yang terdaftar</p>
                </div>

                <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Email</label>
                    <input
                      type="email"
                      placeholder="nama@rectoverso.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <button type="submit" disabled={isLoading} style={{ width: '100%', height: 48, background: isLoading ? '#b91c1c' : '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14 }}>
                    {isLoading ? "Mengirim..." : "Kirim Kode Verifikasi"}
                  </button>
                </form>
              </>
            )}

            {step === 'verify' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Verifikasi Email</h2>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Masukkan kode 6 digit yang dikirim ke</p>
                  <p style={{ color: '#0f172a', fontSize: 14, fontWeight: 500, marginTop: 4 }}>{email}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>(Demo: gunakan kode <span style={{ color: '#2563eb', fontWeight: 600 }}>123456</span>)</p>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#2563eb' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Kode Verifikasi</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          id={`code-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(i, e.target.value)}
                          style={{ width: 48, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: 12, outline: 'none', boxSizing: 'border-box' }}
                        />
                      ))}
                    </div>
                  </div>

                  <button type="submit" style={{ width: '100%', height: 48, background: '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                    Verifikasi
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
                    Tidak menerima kode?{' '}
                    <button type="button" onClick={resendCode} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 500, cursor: 'pointer' }}>
                      Kirim Ulang
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 'reset' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <svg style={{ width: 24, height: 24, color: '#16a34a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Buat Password Baru</h2>
                  <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Password baru harus berbeda dari yang sebelumnya</p>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#2563eb' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Password Baru</label>
                    <input
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Konfirmasi Password</label>
                    <input
                      type="password"
                      placeholder="Masukkan password lagi"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <button type="submit" disabled={isLoading} style={{ width: '100%', height: 48, background: isLoading ? '#b91c1c' : '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 14, marginTop: 8 }}>
                    {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>© 2026 Rectoverso. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  )
}
