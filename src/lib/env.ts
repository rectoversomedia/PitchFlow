/**
 * Environment Validation for PitchFlow
 *
 * Validates that all required environment variables are set
 * before the application starts.
 */

import { z } from 'zod'

// ============================================
// Environment Schema
// ============================================

const envSchema = z.object({
  // Auth (required)
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),

  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),

  // AI - Anthropic Claude (required for AI features)
  ANTHROPIC_API_KEY: z.string().optional(),

  // OpenAI (optional - for image generation only)
  OPENAI_API_KEY: z.string().optional(),

  // Redis for distributed rate limiting (optional)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Google OAuth (optional)
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),

  // Sentry (optional but recommended for production)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // App config
  NEXTAUTH_URL: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

/**
 * Validate environment variables
 * Call this at app startup
 */
export function validateEnvironment(): void {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return
  }

  const result = envSchema.safeParse({
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!result.success) {
    const errors = result.error.issues.map((e) => `  - ${e.path.join('.')}: ${e.message}`)

    console.error('\n❌ Environment Validation Failed\n')
    console.error('Missing or invalid environment variables:\n')
    console.error(errors.join('\n'))
    console.error('\n📝 Please fix your .env.local file and restart the server.\n')

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed')
    }
  }

  // Warn about recommended variables
  if (process.env.NODE_ENV === 'production') {
    const warnings: string[] = []

    if (!process.env.ANTHROPIC_API_KEY) {
      warnings.push('  - ANTHROPIC_API_KEY (AI features will be disabled)')
    }

    if (!process.env.OPENAI_API_KEY) {
      warnings.push('  - OPENAI_API_KEY (Image generation will be disabled)')
    }

    if (!process.env.SENTRY_DSN) {
      warnings.push('  - SENTRY_DSN (error tracking disabled)')
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      warnings.push('  - GOOGLE_CLIENT_SECRET (Google OAuth disabled)')
    }

    if (!process.env.UPSTASH_REDIS_REST_URL) {
      warnings.push('  - UPSTASH_REDIS_REST_URL (using in-memory rate limiting)')
    }

    if (warnings.length > 0) {
      console.warn('\n⚠️  Recommended Variables for Production\n')
      console.warn(warnings.join('\n'))
      console.warn('')
    }
  }
}

/**
 * Get validated environment variables
 */
export function getEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse({
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!result.success) {
    throw new Error('Invalid environment configuration')
  }

  return result.data
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

/**
 * Check if AI features are enabled
 */
export function isAIEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

/**
 * Check if image generation is enabled
 */
export function isImageGenEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY
}
