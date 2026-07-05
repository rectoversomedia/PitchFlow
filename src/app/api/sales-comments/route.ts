import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { checkRateLimit, getRateLimitHeaders, getClientIP } from '@/lib/rate-limit'

// GET - Fetch all sales comments
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'data')
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get('proposalId')

    let query = supabase
      .from('sales_comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (proposalId) {
      query = query.eq('proposal_id', proposalId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { headers: getRateLimitHeaders(rateLimit) }
    )
  } catch (error) {
    console.error('GET sales_comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'data')
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.proposal_id || !body.content) {
      return NextResponse.json(
        { success: false, error: 'proposal_id and content are required' },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    // Add user_id from session
    const commentData = {
      ...body,
      user_id: session.user.id,
    }

    const { data, error } = await supabase
      .from('sales_comments')
      .insert([commentData])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { headers: getRateLimitHeaders(rateLimit) }
    )
  } catch (error) {
    console.error('POST sales_comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update comment
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'data')
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const { data, error } = await supabase
      .from('sales_comments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { headers: getRateLimitHeaders(rateLimit) }
    )
  } catch (error) {
    console.error('PUT sales_comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 'data')
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    const { error } = await supabase
      .from('sales_comments')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: getRateLimitHeaders(rateLimit) }
      )
    }

    return NextResponse.json(
      { success: true },
      { headers: getRateLimitHeaders(rateLimit) }
    )
  } catch (error) {
    console.error('DELETE sales_comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
