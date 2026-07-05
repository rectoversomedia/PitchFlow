import { NextRequest, NextResponse } from 'next/server'
import { briefs as mockBriefs } from '@/lib/mock-data'

// GET - Fetch all briefs
export async function GET(request: NextRequest) {
  try {
    // Return mock data for now
    return NextResponse.json({
      success: true,
      data: mockBriefs
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch briefs' },
      { status: 500 }
    )
  }
}

// POST - Create new brief
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.brand_name || !body.pic_sales || !body.program) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newBrief = {
      id: `brief-${Date.now()}`,
      ...body,
      status: 'new',
      created_at: new Date().toISOString(),
      attachments: body.attachments || []
    }

    return NextResponse.json({
      success: true,
      data: newBrief
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create brief' },
      { status: 500 }
    )
  }
}
