import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

// GET - Fetch user's clients
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: clients, error } = await supabase
      .from('clients')
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
      data: clients || []
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name: body.name,
        brand_name: body.brand_name || null,
        email: body.email || null,
        phone: body.phone || null,
        company: body.company || null,
        industry: body.industry || null,
        address: body.address || null,
        notes: body.notes || null,
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
      data: newClient
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
}

// PUT - Update client
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      )
    }

    // First verify the client belongs to this user (extra security layer)
    const { data: existingClient } = await supabase
      .from('clients')
      .select('created_by')
      .eq('id', body.id)
      .single()

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    if (existingClient.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only update your own clients' },
        { status: 403 }
      )
    }

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update({
        name: body.name,
        brand_name: body.brand_name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        industry: body.industry,
        address: body.address,
        notes: body.notes,
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
      data: updatedClient
    })
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE - Delete client
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
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      )
    }

    // First verify the client belongs to this user (extra security layer)
    const { data: existingClient } = await supabase
      .from('clients')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    if (existingClient.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own clients' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('clients')
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
      message: 'Client deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
