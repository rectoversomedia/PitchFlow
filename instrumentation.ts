// Instrumentation file for Next.js
// This file is used by Next.js to instrument the application

// Enable Sentry in production
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const { init } = await import('@sentry/nextjs')
      init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
      })
    }
  }
}
