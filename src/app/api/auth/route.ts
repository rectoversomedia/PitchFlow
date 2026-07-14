import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

// GET - Get current session
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!session) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null
      })
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: profile ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar_url,
      } : null,
      session: {
        expires_at: session.expires_at,
        email: session.user.email,
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check authentication' },
      { status: 500 }
    )
  }
}

// POST - Sign in with rate limiting and enhanced security
export async function POST(request: NextRequest) {
  try {
    // Rate limiting for auth endpoints
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.auth)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const supabase = await createClient()
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetAt),
          }
        }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Sign in with Supabase Auth (handles password hashing internally)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    })

    if (error) {
      console.error('Sign in error:', error.message)
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        {
          status: 401,
          headers: {
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetAt),
          }
        }
      )
    }

    if (data.user) {
      // Fetch user profile from users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .single()

      // Update last login timestamp
      if (profile) {
        await supabase
          .from('users')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', profile.id)
      }

      return NextResponse.json({
        success: true,
        user: profile ? {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar_url,
        } : {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || null,
          role: data.user.user_metadata?.role || 'ACS',
          avatar: data.user.user_metadata?.avatar_url || null,
        },
        session: {
          expires_at: data.session?.expires_at,
          email: normalizedEmail,
        }
      }, {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Sign in failed' },
      {
        status: 500,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        }
      }
    )
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal masuk. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

// DELETE - Sign out
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
