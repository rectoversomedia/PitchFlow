"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  // Redirect if already logged in
  if (status === "authenticated") {
    router.push(callbackUrl)
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        type: email.includes("@rectoverso.com") ? "existing" : "demo",
        email: email.includes("@rectoverso.com") ? email : undefined,
        redirect: false,
      })

      if (result?.error) {
        setError("Login gagal. Silakan coba lagi.")
      } else {
        router.push(callbackUrl)
      }
    } catch (err: any) {
      setError(err.message || "Login gagal. Silakan coba lagi.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoggingIn(true)
    setError("")
    try {
      // Set demo mode in localStorage
      localStorage.setItem('pitchflow_demo_mode', 'true')

      const result = await signIn("credentials", {
        type: "demo",
        redirect: false,
      })

      if (result?.error) {
        setError("Demo login gagal.")
      } else {
        router.push(callbackUrl)
      }
    } catch (err: any) {
      setError(err.message || "Demo login gagal.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError("")
    try {
      await signIn("google", {
        callbackUrl: callbackUrl,
      })
    } catch (err: any) {
      setError("Google login gagal. Silakan coba lagi.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - Branding (50%) */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background:
            "linear-gradient(135deg, #061A3A 0%, #0f172a 50%, #1e1b4b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
        }}
      >
        {/* Background Effects */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.05,
            }}
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: 400,
              height: 400,
              background: "#2563eb",
              borderRadius: "50%",
              opacity: 0.15,
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "0%",
              width: 300,
              height: 300,
              background: "#7c3aed",
              borderRadius: "50%",
              opacity: 0.1,
              filter: "blur(60px)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          {/* Logo */}
          <div style={{ marginBottom: 48 }}>
            <Image
              src="/picthflow logo (white).png"
              alt="PitchFlow"
              width={240}
              height={68}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Headline */}
          <h1
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 32,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Sponsorship Proposal
            <br />
            Workspace
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 48,
            }}
          >
            From brief to powerful proposal,
            <br />
            smarter & faster with AI.
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              textAlign: "left",
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            {[
              {
                title: "Brief Terstruktur",
                desc: "Kelola brief dengan rapi & terorganisir",
              },
              {
                title: "AI Proposal Builder",
                desc: "Buat proposal lebih cepat dengan AI",
              },
              {
                title: "Kolaborasi dengan Sales",
                desc: "Feedback & komunikasi satu platform",
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: "#2563eb",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    style={{ width: 12, height: 12 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span
                    style={{
                      color: "white",
                      fontSize: 13,
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    {feature.title}
                  </span>
                  <span
                    style={{ color: "#94a3b8", fontSize: 12, display: "block" }}
                  >
                    {feature.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#64748b",
            fontSize: 11,
          }}
        >
          © 2026 Rectoverso. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form (50%) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          background: "white",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              Welcome back!
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Login to access your dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 14,
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#334155",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    style={{ width: 20, height: 20, color: "#94a3b8" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    paddingLeft: 48,
                    paddingRight: 16,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#334155",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    style={{ width: 20, height: 20, color: "#94a3b8" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: 48,
                    paddingLeft: 48,
                    paddingRight: 48,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#0f172a",
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
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg
                      style={{ width: 20, height: 20, color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      style={{ width: 20, height: 20, color: "#94a3b8" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <a
                href="/forgot-password"
                style={{
                  fontSize: 14,
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: "100%",
                height: 48,
                background: isLoggingIn ? "#1d4ed8" : "#2563eb",
                color: "white",
                fontWeight: 600,
                borderRadius: 10,
                border: "none",
                cursor: isLoggingIn ? "not-allowed" : "pointer",
                fontSize: 15,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {isLoggingIn ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Google Login */}
          <button
            type="button"
            disabled={isLoggingIn || isGoogleLoading}
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              height: 48,
              background: "white",
              color: "#334155",
              fontWeight: 500,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              cursor: isLoggingIn || isGoogleLoading ? "not-allowed" : "pointer",
              fontSize: 15,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {isGoogleLoading ? (
              <svg
                style={{
                  width: 20,
                  height: 20,
                  animation: "spin 1s linear infinite",
                }}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoggingIn || isGoogleLoading}
            style={{
              width: "100%",
              height: 48,
              background: "#16a34a",
              color: "white",
              fontWeight: 600,
              borderRadius: 10,
              border: "none",
              cursor: isLoggingIn || isGoogleLoading ? "not-allowed" : "pointer",
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <svg
              style={{ width: 20, height: 20 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Try Demo
          </button>

          {/* Sign up link */}
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#64748b",
              marginTop: 24,
            }}
          >
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* CSS Animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

function LoginLoading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <svg
          style={{
            width: 40,
            height: 40,
            animation: "spin 1s linear infinite",
          }}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <path
            d="M12 2a10 10 0 0110 10"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p style={{ marginTop: 16, color: "#64748b" }}>Loading...</p>
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
