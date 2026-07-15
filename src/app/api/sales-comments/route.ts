import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import {
  validateBody,
  sanitizeObject,
  createSalesCommentSchema,
  uuidSchema,
} from '@/lib/validations'

// GET - Fetch user's sales comments
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: comments, error } = await supabase
      .from('sales_comments')
      .select(`
        *,
        users (name, role)
      `)
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const transformedComments = (comments || []).map(comment => ({
      ...comment,
      user_name: comment.users?.name || 'Unknown',
      user_role: comment.users?.role || 'Unknown',
    }))

    return NextResponse.json({
      success: true,
      data: transformedComments,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt,
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate with Zod
    const validation = validateBody(body, createSalesCommentSchema)
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

    // Sanitize content
    const sanitizedContent = sanitizeObject({ content: validation.data.content }).content

    const { data: newComment, error } = await supabase
      .from('sales_comments')
      .insert({
        proposal_id: validation.data.proposal_id,
        user_id: authUser.id,
        content: sanitizedContent,
        parent_id: validation.data.parent_id || null,
      })
      .select(`
        *,
        users (name, role)
      `)
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const transformedComment = {
      ...newComment,
      user_name: newComment.users?.name || authUser.name || 'Unknown',
      user_role: newComment.users?.role || authUser.role || 'Unknown',
    }

    return NextResponse.json({
      success: true,
      data: transformedComment,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

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
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    // Validate UUID format
    const validation = validateBody({ id }, uuidSchema)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid comment ID format' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: existingComment } = await supabase
      .from('sales_comments')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingComment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (existingComment.user_id !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own comments' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('sales_comments')
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
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
