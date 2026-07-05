import { NextRequest, NextResponse } from 'next/server'
import { proposals as mockProposals } from '@/lib/mock-data'

// GET - Fetch all proposals
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockProposals
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

// POST - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.brand_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProposal = {
      id: `prop-${Date.now()}`,
      ...body,
      status: 'new_brief',
      slides_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newProposal
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create proposal' },
      { status: 500 }
    )
  }
}
