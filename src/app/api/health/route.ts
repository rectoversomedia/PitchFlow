import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      api: 'ok',
      database: 'unknown',
    },
    responseTime: 0,
  }

  // Check database connection
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from('users').select('id').limit(1)

    if (error) {
      health.services.database = 'error'
      health.status = 'degraded'
    } else {
      health.services.database = 'ok'
    }
  } catch {
    health.services.database = 'error'
    health.status = 'degraded'
  }

  health.responseTime = Date.now() - start

  const statusCode = health.status === 'ok' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}
