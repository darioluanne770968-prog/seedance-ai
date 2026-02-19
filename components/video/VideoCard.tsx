'use client'

import Link from 'next/link'
import { Video } from '@prisma/client'
import { Clock, Download, Share2, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface VideoCardProps {
  video: Video
}

const statusColors = {
  PENDING: 'text-gray-400',
  UPLOADING: 'text-blue-400',
  QUEUED: 'text-yellow-400',
  PROCESSING: 'text-blue-400',
  COMPLETED: 'text-green-400',
  FAILED: 'text-red-400',
  ARCHIVED: 'text-gray-400',
}

const statusLabels = {
  PENDING: 'Pending',
  UPLOADING: 'Uploading',
  QUEUED: 'Queued',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  ARCHIVED: 'Archived',
}

export function VideoCard({ video }: VideoCardProps) {
  const isProcessing = ['PENDING', 'QUEUED', 'PROCESSING'].includes(video.status)
  const isCompleted = video.status === 'COMPLETED'
  const isFailed = video.status === 'FAILED'

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
      {/* Thumbnail */}
      <Link href={`/videos/${video.id}`}>
        <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative">
          {isCompleted && video.thumbnailKey ? (
            <img
              src={video.thumbnailKey}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {isProcessing && (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">{video.progress}%</p>
                </div>
              )}
              {isFailed && (
                <p className="text-sm text-red-400">Generation failed</p>
              )}
            </div>
          )}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-medium">
            {video.duration}s
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/videos/${video.id}`}>
          <h3 className="font-semibold mb-1 truncate group-hover:text-purple-400 transition-colors">
            {video.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {video.prompt}
        </p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`${statusColors[video.status]}`}>
              {statusLabels[video.status]}
            </span>
            {isProcessing && video.progress > 0 && (
              <span className="text-muted-foreground">({video.progress}%)</span>
            )}
          </div>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Actions */}
        {isCompleted && (
          <div className="mt-4 flex items-center space-x-2">
            <button className="flex-1 p-2 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors flex items-center justify-center space-x-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
            <button className="flex-1 p-2 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors flex items-center justify-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
