import * as Sentry from '@sentry/nextjs'

/**
 * Sentry error tracking utilities
 */

/**
 * Capture an exception and send to Sentry
 */
export function captureError(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, unknown>
    userId?: string
    email?: string
  }
) {
  if (context?.userId) {
    Sentry.setUser({
      id: context.userId,
      email: context.email,
    })
  }

  if (context?.tags) {
    Sentry.setTags(context.tags)
  }

  if (context?.extra) {
    Sentry.setExtra('data', context.extra)
  }

  Sentry.captureException(error)
}

/**
 * Capture a message (non-error) to Sentry
 */
export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  context?: {
    tags?: Record<string, string>
    extra?: Record<string, unknown>
  }
) {
  if (context?.tags) {
    Sentry.setTags(context.tags)
  }

  if (context?.extra) {
    Sentry.setExtra('data', context.extra)
  }

  Sentry.captureMessage(message, level)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, unknown>,
  category: string = 'custom'
) {
  Sentry.addBreadcrumb({
    message,
    data,
    category,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Create a wrapped error handler for API routes
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      captureError(error, {
        tags: {
          path: new URL(request.url).pathname,
          method: request.method,
        },
        extra: {
          url: request.url,
        },
      })

      return Response.json(
        {
          success: false,
          error: 'An unexpected error occurred',
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }
}
