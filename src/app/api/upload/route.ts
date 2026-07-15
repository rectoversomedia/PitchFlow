import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit, getRateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

function isValidFileType(mimeType: string): boolean {
  return ALLOWED_TYPES.includes(mimeType)
}

function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  }
  return extensions[mimeType] || 'bin'
}

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.upload)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    if (!isValidFileType(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = getExtension(file.type)
    const filename = `${timestamp}-${randomStr}.${extension}`
    const path = `${folder}/${authUser.id}/${filename}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { data, error } = await supabase.storage
      .from('pitchflow-uploads')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from('pitchflow-uploads')
      .getPublicUrl(path)

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        storagePath: path,
        publicUrl: urlData.publicUrl,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

// GET - List uploaded files
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
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'general'

    const { data, error } = await supabase.storage
      .from('pitchflow-uploads')
      .list(`${folder}/${authUser.id}`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to list files' },
        { status: 500 }
      )
    }

    const files = await Promise.all(
      (data || []).map(async (file) => {
        const path = `${folder}/${authUser.id}/${file.name}`
        const { data: urlData } = supabase.storage
          .from('pitchflow-uploads')
          .getPublicUrl(path)

        return {
          name: file.name,
          path: path,
          publicUrl: urlData.publicUrl,
          size: file.metadata?.size,
          type: file.metadata?.mimetype,
          createdAt: file.created_at,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: files,
    })
  } catch (error: any) {
    console.error('List files error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list files' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitResult = await rateLimit(clientIP, RATE_LIMITS.upload)

    if (!rateLimitResult.success) {
      return getRateLimitResponse(rateLimitResult.resetAt)
    }

    const authUser = await requireAuth(request)
    if (authUser instanceof NextResponse) return authUser

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      )
    }

    if (!path.includes(authUser.id)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this file' },
        { status: 403 }
      )
    }

    const { error } = await supabase.storage
      .from('pitchflow-uploads')
      .remove([path])

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete file' },
      { status: 500 }
    )
  }
}
