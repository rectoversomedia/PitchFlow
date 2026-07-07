import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

// GET - Fetch user's sales comments
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()

    const { data: comments, error } = await supabase
      .from('sales_comments')
      .select(`
        *,
        users (name, role)
      `)
      .eq('user_id', authUser.id) // User isolation via RLS
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
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
        user_id: authUser.id, // Always use authenticated user's ID
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
      user_name: newComment.users?.name || authUser.name || 'Unknown',
      user_role: newComment.users?.role || authUser.role || 'Unknown',
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
    // Require authentication
    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    // First verify the comment belongs to this user (extra security layer)
    const { data: existingComment } = await supabase
      .from('sales_comments')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingComment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (existingComment.user_id !== authUser.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own comments' },
        { status: 403 }
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
