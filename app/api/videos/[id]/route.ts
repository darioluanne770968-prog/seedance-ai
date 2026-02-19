import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get video details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const video = await prisma.video.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Get video error:', error)
    return NextResponse.json(
      { error: 'Failed to get video' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete video
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const video = await prisma.video.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Soft delete
    await prisma.video.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete video error:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}

// PATCH - Update video metadata
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { title, isPublic } = body

    const video = await prisma.video.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(typeof isPublic === 'boolean' && { isPublic }),
      },
    })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Update video error:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}
