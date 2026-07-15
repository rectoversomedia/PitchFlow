import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { validateBody, sanitizeObject, uuidSchema } from '@/lib/validations'
import { z } from 'zod'

const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).trim(),
  brand_name: z.string().max(200).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  company: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
})

const updateClientSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(200).trim().optional(),
  brand_name: z.string().max(200).optional().nullable(),
  email: z.string().email().max(200).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

// GET - Fetch user's clients
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

    const { data: clients, error } = await supabase
      .from('clients')
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
      data: clients || [],
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
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, createClientSchema)
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

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        ...validation.data,
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
      data: newClient,
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
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.general)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const body = await request.json()

    const validation = validateBody(body, updateClientSchema)
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

    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(updateData)
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

    if (!updatedClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedClient,
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
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('clients')
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
      message: 'Client deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
