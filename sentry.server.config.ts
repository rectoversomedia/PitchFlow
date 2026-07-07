import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // Profiling (for Node.js)
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0,

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

  // Enable bundling
  integrations: [
    // Http integration for tracing HTTP requests
    Sentry.httpIntegration(),
    // Console integration for logging
    Sentry.consoleIntegration(),
  ],
})

// Export for use in API routes
export { Sentry }
