import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit'

// Get comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comments = await prisma.comment.findMany({
      where: {
        videoId: id,
        parentId: null, // Only top-level comments
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    // Get user info for each comment
    const userIds = new Set<string>()
    comments.forEach(c => {
      userIds.add(c.userId)
      c.replies.forEach(r => userIds.add(r.userId))
    })

    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(userIds) } },
      select: { id: true, name: true, avatar: true },
    })

    const userMap = new Map(users.map(u => [u.id, u]))

    const commentsWithUsers = comments.map(c => ({
      ...c,
      user: userMap.get(c.userId) || { name: 'Unknown', avatar: null },
      replies: c.replies.map(r => ({
        ...r,
        user: userMap.get(r.userId) || { name: 'Unknown', avatar: null },
      })),
    }))

    return NextResponse.json({ comments: commentsWithUsers })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    )
  }
}

// Add comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit comments
    const rateLimitResponse = await withRateLimit(req, 'api', session.user.id)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { id } = await params
    const { content, parentId } = await req.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Check video exists and is public
    const video = await prisma.video.findUnique({
      where: { id },
      select: { id: true, isPublic: true, userId: true },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        videoId: id,
        content: content.trim(),
        parentId: parentId || null,
      },
    })

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, avatar: true },
    })

    return NextResponse.json({
      comment: {
        ...comment,
        user,
        replies: [],
      },
    })
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

// Delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID required' },
        { status: 400 }
      )
    }

    // Check comment belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check ownership (or admin)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (comment.userId !== session.user.id && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
