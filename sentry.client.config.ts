import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay for debugging user issues
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0,

  // Replay on errors for better debugging
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Ignore certain errors
  ignoreErrors: [
    'ResizeObserver loop',
    'Non-Error promise rejection',
  ],

  // Attach stack traces
  attachStacktrace: true,

  // Send default PII (user info from session)
  sendDefaultPii: false,

  // Enable bundling
  integrations: [
    // Browser profiling
    Sentry.browserProfilingIntegration(),
    // Session replay (for debugging user issues)
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
