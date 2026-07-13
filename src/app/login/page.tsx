"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginAsDemo } = useAuth()
  const [error, setError] = useState("")

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleDemoLogin = () => {
    try {
      loginAsDemo()
      // loginAsDemo already handles redirect
    } catch (err: any) {
      setError(err.message || "Demo login gagal.")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/signin/google'
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
              src="/PitchFlow Logo (white).png"
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
          2026 Rectoverso. All rights reserved.
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

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              height: 48,
              background: "white",
              color: "#334155",
              fontWeight: 500,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              fontSize: 15,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
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
            Continue with Google
          </button>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              width: "100%",
              height: 48,
              background: "#16a34a",
              color: "white",
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
            Dont have an account?{" "}
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
