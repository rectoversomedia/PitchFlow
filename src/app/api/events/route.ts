import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

// GET - Fetch user's events
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('created_by', authUser.id) // User isolation via RLS
      .order('event_date', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: events || []
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.title || !body.event_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, event_date' },
        { status: 400 }
      )
    }

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        title: body.title,
        description: body.description || null,
        event_date: body.event_date,
        event_time: body.event_time || null,
        event_type: body.event_type || 'other',
        proposal_id: body.proposal_id || null,
        brief_id: body.brief_id || null,
        client_id: body.client_id || null,
        reminder: body.reminder ?? true,
        reminder_days_before: body.reminder_days_before || 1,
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
      data: newEvent
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // First verify the event belongs to this user (extra security layer)
    const { data: existingEvent } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', body.id)
      .single()

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    if (existingEvent.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only update your own events' },
        { status: 403 }
      )
    }

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title: body.title,
        description: body.description,
        event_date: body.event_date,
        event_time: body.event_time,
        event_type: body.event_type,
        proposal_id: body.proposal_id,
        brief_id: body.brief_id,
        client_id: body.client_id,
        reminder: body.reminder,
        reminder_days_before: body.reminder_days_before,
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
      data: updatedEvent
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE - Delete event
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
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // First verify the event belongs to this user (extra security layer)
    const { data: existingEvent } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    if (existingEvent.created_by !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own events' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('events')
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
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
