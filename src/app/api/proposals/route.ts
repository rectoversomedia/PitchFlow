import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

// GET - Fetch user's proposals
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('created_by', authUser.id) // User isolation via RLS
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
      data: proposals || []
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.brand_name || !body.pic_sales) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, brand_name, pic_sales' },
        { status: 400 }
      )
    }

    const { data: newProposal, error } = await supabase
      .from('proposals')
      .insert({
        title: body.title,
        brand_name: body.brand_name,
        program: body.program || body.title.split(' - ')[1] || '',
        industry: body.industry || null,
        sponsorship_type: body.sponsorship_type || null,
        year: body.year || new Date().getFullYear(),
        status: body.status || 'draft',
        brief_id: body.brief_id || null,
        result: body.result || null,
        pic_sales: body.pic_sales,
        deadline: body.deadline || null,
        last_activity: new Date().toISOString(),
        slides_count: body.slides_count || 0,
        created_by: authUser.id, // Always use authenticated user's ID
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
      data: newProposal
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
      )
    }

    // First verify the proposal belongs to this user (extra security layer)
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('created_by')
      .eq('id', body.id)
      .single()

    if (!existingProposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (existingProposal.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only update your own proposals' },
        { status: 403 }
      )
    }

    const { data: updatedProposal, error } = await supabase
      .from('proposals')
      .update({
        title: body.title,
        brand_name: body.brand_name,
        program: body.program,
        industry: body.industry,
        sponsorship_type: body.sponsorship_type,
        year: body.year,
        status: body.status,
        result: body.result,
        pic_sales: body.pic_sales,
        deadline: body.deadline,
        last_activity: new Date().toISOString(),
        slides_count: body.slides_count,
      })
      .eq('id', body.id)
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
      data: updatedProposal
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
    // Require authentication
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

    // First verify the proposal belongs to this user (extra security layer)
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
        { success: false, error: 'Unauthorized - You can only delete your own proposals' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('proposals')
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
      message: 'Proposal deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete proposal' },
      { status: 500 }
    )
  }
}
