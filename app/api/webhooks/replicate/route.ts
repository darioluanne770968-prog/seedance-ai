import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('Replicate webhook received:', body)

    const { id, status, output, error } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 })
    }

    // Find video by AI task ID
    const video = await prisma.video.findFirst({
      where: { aiTaskId: id },
    })

    if (!video) {
      console.error('Video not found for task ID:', id)
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Update video based on status
    if (status === 'succeeded' && output) {
      const videoUrl = Array.isArray(output) ? output[0] : output

      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'COMPLETED',
          progress: 100,
          outputVideoKey: videoUrl,
          completedAt: new Date(),
        },
      })

      console.log('Video generation completed:', video.id)
    } else if (status === 'failed' || status === 'canceled') {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'FAILED',
          errorMessage: error || 'AI generation failed',
        },
      })

      console.error('Video generation failed:', video.id, error)
    } else if (status === 'processing') {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'PROCESSING',
          progress: 50,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
