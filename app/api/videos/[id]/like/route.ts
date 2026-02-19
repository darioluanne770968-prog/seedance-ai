import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id },
      select: { id: true, isPublic: true, userId: true },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId: id,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          videoId: id,
        },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

// Check if liked
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false })
    }

    const { id } = await params

    const like = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId: id,
        },
      },
    })

    const count = await prisma.like.count({
      where: { videoId: id },
    })

    return NextResponse.json({
      liked: !!like,
      count,
    })
  } catch (error) {
    console.error('Check like error:', error)
    return NextResponse.json({ liked: false, count: 0 })
  }
}
