import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadFile, validateImageFile, validateVideoFile } from '@/lib/upload'
import { withRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResponse = await withRateLimit(req, 'upload', session.user.id)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Get file from form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file based on type
    let validationError: string | null = null
    let folder = 'uploads'

    if (type === 'video') {
      validationError = validateVideoFile(file)
      folder = 'videos'
    } else {
      validationError = validateImageFile(file)
      folder = 'images'
    }

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Upload file
    const result = await uploadFile(file, folder)

    return NextResponse.json({
      url: result.url,
      key: result.key,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
