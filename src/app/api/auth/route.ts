import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

// POST - Sign in
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

    if (data.user) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      return NextResponse.json({
        success: true,
        user: profile ? {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar_url,
        } : null,
        session: {
          expires_at: data.session?.expires_at,
          email: data.user.email,
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Sign in failed' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sign in' },
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
