import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateBody, sanitizeObject, createProposalSchema, updateProposalSchema, deleteProposalSchema } from '@/lib/validations'

// GET - Fetch user's proposals
export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('created_by', authUser.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: proposals || [],
    })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

// POST - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, createProposalSchema)
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

    const sanitizedData = sanitizeObject(validation.data)

    const { data: newProposal, error } = await supabase
      .from('proposals')
      .insert({
        title: sanitizedData.title,
        brand_name: sanitizedData.brand_name,
        pic_sales: sanitizedData.pic_sales,
        program: sanitizedData.program || '',
        industry: sanitizedData.industry || null,
        sponsorship_type: sanitizedData.sponsorship_type || null,
        year: sanitizedData.year || new Date().getFullYear(),
        status: 'new_brief',
        brief_id: sanitizedData.brief_id || null,
        result: null,
        deadline: sanitizedData.deadline || null,
        last_activity: new Date().toISOString(),
        slides_count: sanitizedData.slides_count || 0,
        created_by: authUser.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newProposal,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create proposal' },
      { status: 500 }
    )
  }
}

// PUT - Update proposal
export async function PUT(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, updateProposalSchema)
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
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingProposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (existingProposal.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const sanitizedData = sanitizeObject(updateData)

    const { data: updatedProposal, error } = await supabase
      .from('proposals')
      .update({
        ...sanitizedData,
        last_activity: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProposal,
    })
  } catch (error) {
    console.error('Error updating proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update proposal' },
      { status: 500 }
    )
  }
}

// DELETE - Delete proposal
export async function DELETE(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingProposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (existingProposal.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete proposal' },
      { status: 500 }
    )
  }
}
