import { NextRequest, NextResponse } from 'next/server'

// Mock events data
const mockEvents = [
  { id: 'event-1', title: 'Deadline Submission Proposal Wardah', description: 'Submit proposal final untuk review', date: '2026-07-15', time: '17:00', type: 'deadline', client_id: 'client-1' },
  { id: 'event-2', title: 'Meeting dengan Tim Sales OPPO', description: 'Diskusi brief terbaru OPPO Reno Series', date: '2026-07-10', time: '14:00', type: 'meeting', client_id: 'client-2' },
  { id: 'event-3', title: 'Presentasi Proposal Indomie', description: 'Pitch proposal ke tim marketing Indomie', date: '2026-07-20', time: '10:00', type: 'presentation', client_id: 'client-3' },
  { id: 'event-4', title: 'Milestone: Proposal Ready Shopee', description: 'Proposal Shopee siap dikirim ke Sales', date: '2026-07-25', time: '09:00', type: 'milestone', client_id: 'client-4' },
]

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockEvents
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newEvent
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
