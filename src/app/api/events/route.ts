import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateBody, sanitizeObject, uuidSchema } from '@/lib/validations'
import { z } from 'zod'

const eventTypeSchema = z.enum(['deadline', 'meeting', 'milestone', 'presentation', 'other'])

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(1000).optional(),
  event_date: z.string().min(1, 'Event date is required'),
  event_time: z.string().max(20).optional(),
  event_type: eventTypeSchema.optional(),
  proposal_id: uuidSchema.optional(),
  brief_id: uuidSchema.optional(),
  client_id: uuidSchema.optional(),
  reminder: z.boolean().optional(),
  reminder_days_before: z.number().int().positive().max(30).optional(),
})

const updateEventSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(1000).optional().nullable(),
  event_date: z.string().optional(),
  event_time: z.string().max(20).optional().nullable(),
  event_type: eventTypeSchema.optional().nullable(),
  proposal_id: uuidSchema.optional().nullable(),
  brief_id: uuidSchema.optional().nullable(),
  client_id: uuidSchema.optional().nullable(),
  reminder: z.boolean().optional().nullable(),
  reminder_days_before: z.number().int().positive().max(30).optional().nullable(),
})

// GET - Fetch user's events
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

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('created_by', authUser.id)
      .order('event_date', { ascending: true })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: events || [],
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
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, createEventSchema)
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

    const sanitized = sanitizeObject(validation.data)

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        ...sanitized,
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
      data: newEvent,
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
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, updateEventSchema)
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
    const sanitized = sanitizeObject(updateData)

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(sanitized)
      .eq('id', id)
      .eq('created_by', authUser.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
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
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('created_by', authUser.id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
