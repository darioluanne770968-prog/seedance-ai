import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - User requests a refund
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId, reason } = await req.json()

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      )
    }

    // Check if video belongs to user and is failed
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id,
        status: 'FAILED',
        creditsUsed: { gt: 0 },
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found or not eligible for refund' },
        { status: 404 }
      )
    }

    // Check if already refunded (simple check via error message)
    if (video.errorMessage?.includes('[Refunded')) {
      return NextResponse.json(
        { error: 'This video has already been refunded' },
        { status: 400 }
      )
    }

    // Auto-refund credits for failed videos
    await prisma.$transaction([
      prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          credits: { increment: video.creditsUsed },
        },
      }),
      prisma.video.update({
        where: { id: videoId },
        data: {
          errorMessage: `${video.errorMessage || 'Generation failed'} [Refunded: ${video.creditsUsed} credits]`,
          creditsUsed: 0,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      creditsRefunded: video.creditsUsed,
      message: `${video.creditsUsed} credits have been refunded to your account`,
    })
  } catch (error) {
    console.error('Refund request error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund request' },
      { status: 500 }
    )
  }
}
