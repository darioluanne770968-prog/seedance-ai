import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Server-Sent Events for real-time video progress
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Verify video belongs to user
  const video = await prisma.video.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!video) {
    return new Response('Not found', { status: 404 })
  }

  // Set up SSE stream
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        )
      }

      // Send initial status
      sendEvent({
        type: 'status',
        id: video.id,
        status: video.status,
        progress: video.progress,
      })

      // Poll for updates (in production, use Redis pub/sub or similar)
      let lastStatus = video.status
      let lastProgress = video.progress
      let attempts = 0
      const maxAttempts = 300 // 5 minutes at 1 second intervals

      const checkProgress = async () => {
        if (attempts >= maxAttempts) {
          sendEvent({ type: 'timeout' })
          controller.close()
          return
        }

        attempts++

        try {
          const updated = await prisma.video.findUnique({
            where: { id },
            select: {
              status: true,
              progress: true,
              outputVideoKey: true,
              errorMessage: true,
            },
          })

          if (!updated) {
            sendEvent({ type: 'error', message: 'Video not found' })
            controller.close()
            return
          }

          // Send update if changed
          if (updated.status !== lastStatus || updated.progress !== lastProgress) {
            lastStatus = updated.status
            lastProgress = updated.progress

            sendEvent({
              type: 'progress',
              status: updated.status,
              progress: updated.progress,
              videoUrl: updated.outputVideoKey,
              error: updated.errorMessage,
            })
          }

          // Complete if finished
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            sendEvent({
              type: 'complete',
              status: updated.status,
              videoUrl: updated.outputVideoKey,
              error: updated.errorMessage,
            })
            controller.close()
            return
          }

          // Continue polling
          setTimeout(checkProgress, 1000)
        } catch (error) {
          sendEvent({ type: 'error', message: 'Failed to check progress' })
          setTimeout(checkProgress, 2000)
        }
      }

      // Start polling after initial send
      setTimeout(checkProgress, 1000)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
