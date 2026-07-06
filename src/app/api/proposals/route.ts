import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all proposals
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('*')
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
    const supabase = await createClient()
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
        created_by: body.created_by || null,
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
    const supabase = await createClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
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
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
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
