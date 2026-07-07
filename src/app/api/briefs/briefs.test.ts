import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies before importing route
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}))

const mockAuth = vi.mocked(import('@/lib/auth'))
const mockSupabase = vi.mocked(import('@/lib/supabase/server'))

describe('POST /api/briefs', () => {
  let mockUser: any
  let mockSupabaseClient: any

  beforeEach(async () => {
    vi.clearAllMocks()

    // Setup mock user
    mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'Sales',
    }

    // Setup mock Supabase client
    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: null
        }),
      }),
    }

    // Setup auth mock
    mockAuth.auth.mockResolvedValue({
      user: mockUser,
    })

    // Setup supabase mock
    mockSupabase.createServerClient.mockResolvedValue(mockSupabaseClient)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should validate required fields', async () => {
    // Import route after mocks are set up
    const { POST } = await import('@/app/api/briefs/route')

    const request = new NextRequest('http://localhost:3000/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Missing required fields
        brand_name: 'Test Brand',
        // pic_sales missing
        // program missing
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('Missing required fields')
  })

  it('should accept valid brief data', async () => {
    const { POST } = await import('@/app/api/briefs/route')

    const newBrief = {
      id: 'new-brief-id',
      brand_name: 'Test Brand',
      pic_sales: 'John Doe',
      program: 'Test Program',
      industry_category: 'Technology',
    }

    // Mock successful insert
    mockSupabaseClient.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: newBrief,
            error: null,
          }),
        }),
      }),
    })

    const request = new NextRequest('http://localhost:3000/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_name: 'Test Brand',
        pic_sales: 'John Doe',
        program: 'Test Program',
        industry_category: 'Technology',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.brand_name).toBe('Test Brand')
  })
})

describe('GET /api/briefs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch briefs for authenticated user', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    }

    const mockBriefs = [
      { id: '1', brand_name: 'Brand A', created_by: 'test-user-id' },
      { id: '2', brand_name: 'Brand B', created_by: 'test-user-id' },
    ]

    const mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockBriefs,
          error: null,
        }),
      }),
    }

    mockAuth.auth.mockResolvedValue({ user: mockUser })
    mockSupabase.createServerClient.mockResolvedValue(mockSupabaseClient)

    const { GET } = await import('@/app/api/briefs/route')

    const request = new NextRequest('http://localhost:3000/api/briefs', {
      method: 'GET',
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveLength(2)
  })
})
