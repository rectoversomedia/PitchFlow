import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all sales comments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: comments, error } = await supabase
      .from('sales_comments')
      .select(`
        *,
        users (name, role)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Transform to include user_name and user_role
    const transformedComments = (comments || []).map(comment => ({
      ...comment,
      user_name: comment.users?.name || 'Unknown',
      user_role: comment.users?.role || 'Unknown',
    }))

    return NextResponse.json({
      success: true,
      data: transformedComments
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
    const supabase = await createClient()
    const body = await request.json()

    if (!body.proposal_id || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: proposal_id, content' },
        { status: 400 }
      )
    }

    const { data: newComment, error } = await supabase
      .from('sales_comments')
      .insert({
        proposal_id: body.proposal_id,
        user_id: body.user_id || null,
        content: body.content,
        parent_id: body.parent_id || null,
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

    // Transform response
    const transformedComment = {
      ...newComment,
      user_name: newComment.users?.name || 'Unknown',
      user_role: newComment.users?.role || 'Unknown',
    }

    return NextResponse.json({
      success: true,
      data: transformedComment
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
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
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
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
