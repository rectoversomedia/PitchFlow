import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import {
  validateBody,
  sanitizeObject,
  createBriefSchema,
  updateBriefSchema,
  deleteBriefSchema,
} from '@/lib/validations'

// GET - Fetch user's briefs
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: briefs, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('created_by', authUser.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: briefs || [],
      rateLimit: {
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt,
      },
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
      },
    })
  } catch (error) {
    console.error('Error fetching briefs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch briefs' },
      { status: 500 }
    )
  }
}

// POST - Create new brief
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate with Zod
    const validation = validateBody(body, createBriefSchema)
    if (!validation.success) {
      const errors = (validation as any).error?.errors || []
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedData = sanitizeObject(validation.data)

    const { data: newBrief, error } = await supabase
      .from('briefs')
      .insert({
        ...sanitizedData,
        status: 'new',
        created_by: authUser.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newBrief,
    }, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
      },
    })
  } catch (error) {
    console.error('Error creating brief:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create brief' },
      { status: 500 }
    )
  }
}

// PUT - Update brief
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate with Zod
    const validation = validateBody(body, updateBriefSchema)
    if (!validation.success) {
      const errors = (validation as any).error?.errors || []
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    const { id, ...updateData } = validation.data

    // Verify ownership
    const { data: existingBrief } = await supabase
      .from('briefs')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingBrief) {
      return NextResponse.json(
        { success: false, error: 'Brief not found' },
        { status: 404 }
      )
    }

    if (existingBrief.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only update your own briefs' },
        { status: 403 }
      )
    }

    // Sanitize input
    const sanitizedData = sanitizeObject(updateData)

    const { data: updatedBrief, error } = await supabase
      .from('briefs')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedBrief,
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
      },
    })
  } catch (error) {
    console.error('Error updating brief:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update brief' },
      { status: 500 }
    )
  }
}

// DELETE - Delete brief
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Brief ID is required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const validation = validateBody({ id }, deleteBriefSchema)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid brief ID format' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: existingBrief } = await supabase
      .from('briefs')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingBrief) {
      return NextResponse.json(
        { success: false, error: 'Brief not found' },
        { status: 404 }
      )
    }

    if (existingBrief.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own briefs' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('briefs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Brief deleted successfully',
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
      },
    })
  } catch (error) {
    console.error('Error deleting brief:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete brief' },
      { status: 500 }
    )
  }
}
