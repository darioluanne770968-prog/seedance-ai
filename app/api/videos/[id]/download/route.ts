import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const video = await prisma.video.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.status !== 'COMPLETED' || !video.outputVideoKey) {
      return NextResponse.json(
        { error: 'Video not ready for download' },
        { status: 400 }
      )
    }

    // If video URL is external (from AI service), redirect to it
    if (video.outputVideoKey.startsWith('http')) {
      return NextResponse.redirect(video.outputVideoKey)
    }

    // If video is stored locally, serve it
    return NextResponse.json({
      url: video.outputVideoKey,
      filename: `${video.title.replace(/[^a-z0-9]/gi, '_')}.mp4`,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    )
  }
}
