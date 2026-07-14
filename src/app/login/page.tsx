"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleDemoLogin = () => {
    // Demo login - use test credentials
    signIn("credentials", {
      email: "demo@pitchflow.app",
      password: "demo",
      callbackUrl: "/dashboard",
    })
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password salah")
      setIsLoading(false)
      return
    }

    router.push(callbackUrl)
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "40px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#061A3A",
            margin: 0,
            letterSpacing: "-0.02em",
          }}>
            PitchFlow
          </h1>
          <p style={{
            fontSize: 14,
            color: "#64748b",
            margin: "8px 0 0 0",
          }}>
            AI-Powered Sponsorship Workspace
          </p>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#0f172a",
            margin: "0 0 8px 0",
          }}>
            Welcome back!
          </h2>
          <p style={{
            fontSize: 14,
            color: "#64748b",
            margin: 0,
          }}>
            Login to access your dashboard.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
            color: "#dc2626",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              color: "#374151",
              marginBottom: 8,
            }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 14px 0 44px",
                  fontSize: 15,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              color: "#374151",
              marginBottom: 8,
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  height: 48,
                  padding: "0 44px 0 44px",
                  fontSize: 15,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <a href="/forgot-password" style={{
              fontSize: 13,
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Lupa kata sandi?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 48,
              background: "#2563eb",
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                Processing...
              </>
            ) : "Log In"}
          </button>
        </form>

        <div style={{
          display: "flex",
          alignItems: "center",
          margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ padding: "0 16px", color: "#94a3b8", fontSize: 14 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <button
          onClick={handleDemoLogin}
          style={{
            width: "100%",
            height: 48,
            background: "#16a34a",
            color: "white",
            fontSize: 15,
            fontWeight: 500,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Try Demo
        </button>

        <p style={{
          textAlign: "center",
          fontSize: 14,
          color: "#64748b",
          marginTop: 24,
        }}>
          Don't have an account?{" "}
          <a href="/signup" style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 500,
          }}>
            Sign up
          </a>
        </p>
      </div>

      <div style={{
        position: "fixed",
        bottom: 16,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 12,
      }}>
        © 2026 Rectoverso. All rights reserved.
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function LoginLoading() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40,
          height: 40,
          border: "3px solid #e2e8f0",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
