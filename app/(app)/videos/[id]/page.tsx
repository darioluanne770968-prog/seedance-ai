import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Download, Share2, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function VideoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  const video = await prisma.video.findUnique({
    where: {
      id: params.id,
      userId: session!.user.id,
      deletedAt: null,
    },
  })

  if (!video) {
    notFound()
  }

  const isProcessing = ['PENDING', 'QUEUED', 'PROCESSING'].includes(video.status)
  const isCompleted = video.status === 'COMPLETED'
  const isFailed = video.status === 'FAILED'

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/videos"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
            {isCompleted && video.outputVideoKey ? (
              <video
                src={video.outputVideoKey}
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            ) : isProcessing ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-semibold mb-2">Generating Video</p>
                  <p className="text-muted-foreground">{video.progress}% complete</p>
                </div>
              </div>
            ) : isFailed ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-900/50 to-pink-900/50">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Generation Failed</p>
                  <p className="text-sm text-muted-foreground">{video.errorMessage}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                <p className="text-muted-foreground">No video available</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {isCompleted && (
            <div className="flex items-center space-x-3">
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="px-4 py-3 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Prompt</h3>
              <p className="text-sm text-muted-foreground">{video.prompt}</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {video.generationType === 'TEXT_TO_VIDEO'
                    ? 'Text to Video'
                    : 'Image to Video'}
                </span>
              </div>

              {video.style && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium capitalize">{video.style}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{video.duration}s</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium">{video.resolution}</span>
              </div>

              {video.width && video.height && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">
                    {video.width} x {video.height}
                  </span>
                </div>
              )}

              {video.fileSize && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium">
                    {(video.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
