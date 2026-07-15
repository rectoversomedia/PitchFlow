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
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "white",
        borderRadius: 20,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        padding: "40px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
            Login to access your workspace
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
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
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
                  fontSize: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 6,
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
                  fontSize: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
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

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <a href="/forgot-password" style={{
              fontSize: 13,
              color: "#667eea",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 48,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
              transition: "opacity 0.2s",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                Processing...
              </>
            ) : "Sign In"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          fontSize: 14,
          color: "#64748b",
          marginTop: 24,
        }}>
          Don't have an account?{" "}
          <a href="/signup" style={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: 600,
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
        color: "rgba(255,255,255,0.7)",
        fontSize: 12,
      }}>
        © 2026 Rectoverso Media. All rights reserved.
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
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: "4px solid rgba(255,255,255,0.3)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
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
