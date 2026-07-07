import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

// GET - Fetch user's briefs
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: briefs, error } = await supabase
      .from('briefs')
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
      data: briefs || []
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.brand_name || !body.pic_sales || !body.program) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: brand_name, pic_sales, program' },
        { status: 400 }
      )
    }

    const { data: newBrief, error } = await supabase
      .from('briefs')
      .insert({
        brand_name: body.brand_name,
        pic_sales: body.pic_sales,
        program: body.program,
        industry_category: body.industry_category || null,
        pic_contact: body.pic_contact || null,
        sponsorship_type: body.sponsorship_type || null,
        objective: body.objective || null,
        target_audience: body.target_audience || null,
        period: body.period || null,
        deadline: body.deadline || null,
        budget_range: body.budget_range || null,
        budget_note: body.budget_note || null,
        notes: body.notes || null,
        attachments: body.attachments || [],
        status: 'new',
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
      data: newBrief
    }, { status: 201 })
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Brief ID is required' },
        { status: 400 }
      )
    }

    // First verify the brief belongs to this user (extra security layer)
    const { data: existingBrief } = await supabase
      .from('briefs')
      .select('created_by')
      .eq('id', body.id)
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

    const { data: updatedBrief, error } = await supabase
      .from('briefs')
      .update({
        brand_name: body.brand_name,
        industry_category: body.industry_category,
        pic_sales: body.pic_sales,
        pic_contact: body.pic_contact,
        program: body.program,
        sponsorship_type: body.sponsorship_type,
        objective: body.objective,
        target_audience: body.target_audience,
        period: body.period,
        deadline: body.deadline,
        budget_range: body.budget_range,
        budget_note: body.budget_note,
        notes: body.notes,
        attachments: body.attachments,
        status: body.status,
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
      data: updatedBrief
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

    // First verify the brief belongs to this user (extra security layer)
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
      message: 'Brief deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting brief:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete brief' },
      { status: 500 }
    )
  }
}
