"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg style={{ width: 40, height: 40, color: '#16a34a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>Password Berhasil Diubah!</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>Password Anda telah berhasil diperbarui. Sekarang Anda bisa masuk dengan password baru.</p>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 32px', background: '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>
            Masuk ke PitchFlow
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ display: 'none', width: '50%', position: 'relative', background: 'linear-gradient(135deg, #061A3A 0%, #0f172a 50%, #1e1b4b 100%)', overflow: 'hidden' }} className="lg:flex">
        <div style={{ position: 'absolute', inset: 0 }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, background: '#2563eb', borderRadius: '50%', opacity: 0.2, filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, background: '#7c3aed', borderRadius: '50%', opacity: 0.15, filter: 'blur(100px)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: '#2563eb', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>PF</span>
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>PitchFlow</h1>
              <p style={{ color: '#94a3b8', fontSize: 12 }}>by Rectoverso</p>
            </div>
          </div>
          <div>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: 48, lineHeight: 1.1, marginBottom: 16 }}>Password<br/>Baru</h2>
            <p style={{ color: '#cbd5e1', fontSize: 18, maxWidth: 400, lineHeight: 1.6 }}>Buat password baru yang mudah diingat tapi sulit ditebak.</p>
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>© 2026 Rectoverso. All rights reserved.</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: 32, border: '1px solid #f1f5f9' }}>
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, textDecoration: 'none', color: '#64748b', fontSize: 14 }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Kembali ke Login
            </Link>

            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a' }}>Buat Password Baru</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Password baru harus berbeda dari yang sebelumnya</p>
            </div>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Password Baru</label>
                <input type="password" placeholder="Minimal 6 karakter" style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#334155' }}>Konfirmasi Password</label>
                <input type="password" placeholder="Masukkan password lagi" style={{ width: '100%', height: 48, paddingLeft: 16, paddingRight: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} required />
              </div>

              <button type="submit" disabled={isLoading} style={{ width: '100%', height: 48, background: isLoading ? '#b91c1c' : '#2563eb', color: 'white', fontWeight: 600, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 14, marginTop: 8 }}>
                {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 24 }}>© 2026 Rectoverso. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  )
}
