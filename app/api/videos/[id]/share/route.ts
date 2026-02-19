import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

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

    if (video.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Video not ready for sharing' },
        { status: 400 }
      )
    }

    // Generate share token if not exists
    let shareToken = video.shareToken
    if (!shareToken) {
      shareToken = randomBytes(16).toString('hex')
      await prisma.video.update({
        where: { id },
        data: {
          shareToken,
          isPublic: true,
        },
      })
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${shareToken}`

    return NextResponse.json({ shareUrl, shareToken })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    )
  }
}

// DELETE - Disable sharing
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

    await prisma.video.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isPublic: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unshare error:', error)
    return NextResponse.json(
      { error: 'Failed to disable sharing' },
      { status: 500 }
    )
  }
}
