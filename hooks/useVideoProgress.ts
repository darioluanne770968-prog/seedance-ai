'use client'

import { useEffect, useState, useCallback } from 'react'

interface VideoProgress {
  status: 'PENDING' | 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  videoUrl?: string
  error?: string
}

interface UseVideoProgressOptions {
  onComplete?: (videoUrl: string) => void
  onError?: (error: string) => void
}

export function useVideoProgress(
  videoId: string | null,
  options: UseVideoProgressOptions = {}
) {
  const [progress, setProgress] = useState<VideoProgress>({
    status: 'PENDING',
    progress: 0,
  })
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(() => {
    if (!videoId) return

    const eventSource = new EventSource(`/api/videos/${videoId}/progress`)

    eventSource.onopen = () => {
      setConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case 'status':
          case 'progress':
            setProgress({
              status: data.status,
              progress: data.progress || 0,
              videoUrl: data.videoUrl,
              error: data.error,
            })
            break

          case 'complete':
            setProgress({
              status: data.status,
              progress: 100,
              videoUrl: data.videoUrl,
              error: data.error,
            })
            if (data.status === 'COMPLETED' && data.videoUrl) {
              options.onComplete?.(data.videoUrl)
            } else if (data.status === 'FAILED') {
              options.onError?.(data.error || 'Generation failed')
            }
            eventSource.close()
            break

          case 'error':
            setError(data.message)
            options.onError?.(data.message)
            break

          case 'timeout':
            setError('Connection timed out')
            eventSource.close()
            break
        }
      } catch (e) {
        console.error('Failed to parse SSE message:', e)
      }
    }

    eventSource.onerror = () => {
      setConnected(false)
      setError('Connection lost')
      eventSource.close()

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (progress.status !== 'COMPLETED' && progress.status !== 'FAILED') {
          connect()
        }
      }, 3000)
    }

    return () => {
      eventSource.close()
    }
  }, [videoId, options.onComplete, options.onError])

  useEffect(() => {
    const cleanup = connect()
    return cleanup
  }, [connect])

  return {
    ...progress,
    connected,
    connectionError: error,
    isProcessing: ['PENDING', 'UPLOADING', 'QUEUED', 'PROCESSING'].includes(progress.status),
    isComplete: progress.status === 'COMPLETED',
    isFailed: progress.status === 'FAILED',
  }
}

// Hook for multiple videos
export function useMultipleVideoProgress(videoIds: string[]) {
  const [progressMap, setProgressMap] = useState<Record<string, VideoProgress>>({})

  useEffect(() => {
    const eventSources: EventSource[] = []

    videoIds.forEach((videoId) => {
      const eventSource = new EventSource(`/api/videos/${videoId}/progress`)

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'progress' || data.type === 'status' || data.type === 'complete') {
            setProgressMap((prev) => ({
              ...prev,
              [videoId]: {
                status: data.status,
                progress: data.progress || 0,
                videoUrl: data.videoUrl,
                error: data.error,
              },
            }))
          }

          if (data.type === 'complete') {
            eventSource.close()
          }
        } catch (e) {
          console.error('Failed to parse SSE message:', e)
        }
      }

      eventSource.onerror = () => {
        eventSource.close()
      }

      eventSources.push(eventSource)
    })

    return () => {
      eventSources.forEach((es) => es.close())
    }
  }, [videoIds.join(',')])

  return progressMap
}
