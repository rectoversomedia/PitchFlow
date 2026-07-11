import { init, captureException, captureMessage, withScope } from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN
const NODE_ENV = process.env.NODE_ENV

// Only initialize Sentry if DSN is available and not in development
if (SENTRY_DSN && NODE_ENV !== 'development') {
  init({
    dsn: SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,

    // Error sampling
    sampleRate: NODE_ENV === 'production' ? 0.1 : 1.0,

    // Environment
    environment: NODE_ENV || 'development',

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version,

    // Enable debug mode in development
    debug: false,

    // Replay for better debugging (optional, requires Sentry Pro)
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,

    // Ignore errors from these paths
    ignoreErrors: [
      // Browser extensions
      'Extension context invalidated',
      'ResizeObserver loop limit exceeded',
      // Third party scripts
      'No FK.php',
      // Network errors
      'Failed to fetch',
      'NetworkError when attempting to fetch resource',
      // Auth errors (handled by our code)
      'NEXT_REDIRECT',
    ],

    // Deny URLs that should be ignored
    denyUrls: [
      // Chrome extensions
      /extensions/i,
      // Facebook
      /graph\.facebook\.com/i,
      // Other third-party
      /web\-packet/i,
    ],

    // Breadcrumb limits
    maxBreadcrumbs: 50,

    // Before send hook for additional processing
    beforeSend(event, hint) {
      // Don't send events in development
      if (NODE_ENV === 'development') {
        console.log('[Sentry] Would send event:', event.exception?.values?.[0]?.value)
        return null
      }

      // Sanitize sensitive data
      if (event.request?.headers) {
        // Remove sensitive headers
        delete event.request.headers['x-api-key']
        delete event.request.headers['authorization']
      }

      return event
    },

    // Before send transaction hook
    beforeSendTransaction(transaction) {
      // Don't send health check transactions
      if (transaction.contexts?.route?.pathname === '/api/health') {
        return null
      }
      return transaction
    },
  })

  console.log('[Sentry] Error tracking initialized')
}

/**
 * Track an error with Sentry
 */
export function trackError(error: Error, context?: Record<string, unknown>): void {
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    console.error('[Error Tracking]', error.message, context)
    return
  }

  withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    captureException(error)
  })
}

/**
 * Track a message with Sentry
 */
export function trackMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
): void {
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message, context)
    return
  }

  withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }

    captureMessage(message, level)
  })
}

/**
 * Track user action for analytics
 */
export function trackUserAction(
  action: string,
  properties?: Record<string, unknown>
): void {
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    return
  }

  withScope((scope) => {
    scope.setTag('action', action)
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    captureMessage(`User Action: ${action}`, 'info')
  })
}

/**
 * Track API performance
 */
export function trackAPIPerformance(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs: number
): void {
  if (!SENTRY_DSN || NODE_ENV === 'development') {
    return
  }

  // Only track slow requests or errors
  if (durationMs > 1000 || statusCode >= 400) {
    withScope((scope) => {
      scope.setTag('api.endpoint', endpoint)
      scope.setTag('api.method', method)
      scope.setTag('api.status', String(statusCode))
      scope.setExtra('duration_ms', durationMs)

      if (statusCode >= 500) {
        captureMessage(`API Error: ${method} ${endpoint}`, 'error')
      }
    })
  }
}

/**
 * Create a span for performance tracking
 */
export async function withTracking<T>(
  name: string,
  fn: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const start = Date.now()

  try {
    const result = await fn()
    const duration = Date.now() - start

    if (duration > 2000) {
      trackMessage(`Slow operation: ${name} (${duration}ms)`, 'warning', tags)
    }

    return result
  } catch (error) {
    trackError(error as Error, { operation: name, ...tags })
    throw error
  }
}

export { captureException, captureMessage, withScope }
