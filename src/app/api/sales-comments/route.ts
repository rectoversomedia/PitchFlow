import { NextRequest, NextResponse } from 'next/server'
import { salesComments as mockComments } from '@/lib/mock-data'
import { currentUser } from '@/lib/mock-data'

// GET - Fetch all sales comments
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockComments
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.proposal_id || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      proposal_id: body.proposal_id,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      content: body.content,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newComment
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
