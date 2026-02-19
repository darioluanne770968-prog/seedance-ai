import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { id, status, output, error } = body

    // Find image by AI task ID
    const image = await prisma.image.findFirst({
      where: { aiTaskId: id },
      include: { user: { select: { email: true } } },
    })

    if (!image) {
      console.log('Image not found for prediction:', id)
      return NextResponse.json({ received: true })
    }

    // Update based on status
    if (status === 'succeeded' && output) {
      const outputUrl = Array.isArray(output) ? output[0] : output

      await prisma.image.update({
        where: { id: image.id },
        data: {
          status: 'COMPLETED',
          progress: 100,
          outputImageKey: outputUrl,
        },
      })
    } else if (status === 'failed' || status === 'canceled') {
      // Refund credits on failure
      await prisma.$transaction([
        prisma.image.update({
          where: { id: image.id },
          data: {
            status: 'FAILED',
            errorMessage: error || 'Generation failed',
            creditsUsed: 0,
          },
        }),
        prisma.subscription.update({
          where: { userId: image.userId },
          data: { credits: { increment: 10 } },
        }),
      ])
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Image webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
