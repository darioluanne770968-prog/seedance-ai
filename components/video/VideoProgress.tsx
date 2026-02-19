'use client'

import { useEffect, useState } from 'react'
import { Video } from '@prisma/client'
import { VideoCard } from './VideoCard'

interface VideoProgressProps {
  initialVideo: Video
}

export function VideoProgress({ initialVideo }: VideoProgressProps) {
  const [video, setVideo] = useState(initialVideo)
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    // Stop polling if video is completed or failed
    if (['COMPLETED', 'FAILED', 'ARCHIVED'].includes(video.status)) {
      setPolling(false)
      return
    }

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/videos/${video.id}`)
        if (response.ok) {
          const updatedVideo = await response.json()
          setVideo(updatedVideo)

          // Stop polling when done
          if (['COMPLETED', 'FAILED', 'ARCHIVED'].includes(updatedVideo.status)) {
            setPolling(false)
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error('Poll error:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [video.id, video.status])

  return <VideoCard video={video} />
}
