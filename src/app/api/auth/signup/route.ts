/**
 * Signup API Route for PitchFlow
 * Handles user registration with secure password hashing
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hashPassword, validatePasswordStrength } from '@/lib/password'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.auth)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const supabase = await createClient()
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password tidak memenuhi syarat',
          details: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['Supervisor', 'ACS', 'Sales']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create user with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password, // Supabase will hash this internally
      email_confirm: true, // Auto-confirm for simplicity, or set to false for email verification
      user_metadata: {
        name: name,
        role: role || 'ACS',
      },
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      )
    }

    if (!authUser.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email.toLowerCase(),
        name: name,
        role: role || 'ACS',
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the signup, user is already created in auth
    }

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: authUser.user.id,
        email: email.toLowerCase(),
        name: name,
        role: role || 'ACS',
      },
    }, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process signup' },
      { status: 500 }
    )
  }
}
