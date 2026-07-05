import { NextRequest, NextResponse } from 'next/server'

// Mock clients data
const mockClients = [
  { id: 'client-1', name: 'Wardah Indonesia', brand_name: 'Wardah', email: 'marketing@wardah.com', phone: '021-12345678', company: 'Wardah Cosmetics', industry: 'Beauty & Personal Care', address: 'Jakarta Selatan' },
  { id: 'client-2', name: 'OPPO Indonesia', brand_name: 'OPPO', email: 'marketing@oppo.co.id', phone: '021-87654321', company: 'OPPO Indonesia', industry: 'Technology', address: 'Jakarta Pusat' },
  { id: 'client-3', name: 'Indomie', brand_name: 'Indomie', email: 'marketing@indomie.com', phone: '021-5551234', company: 'Indofood', industry: 'Food & Beverage', address: 'Jakarta Utara' },
  { id: 'client-4', name: 'Shopee Indonesia', brand_name: 'Shopee', email: 'bd@shopee.co.id', phone: '021-99988877', company: 'Shopee Indonesia', industry: 'E-commerce', address: 'Jakarta Selatan' },
  { id: 'client-5', name: 'Bank BCA', brand_name: 'BCA', email: 'marketing@bca.co.id', phone: '021-23588000', company: 'Bank BCA', industry: 'Banking & Finance', address: 'Jakarta Pusat' },
]

// GET - Fetch all clients
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockClients
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.brand_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newClient = {
      id: `client-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newClient
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
