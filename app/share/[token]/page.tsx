import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Sparkles, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function SharePage({
  params,
}: {
  params: { token: string }
}) {
  const video = await prisma.video.findUnique({
    where: {
      shareToken: params.token,
      isPublic: true,
      status: 'COMPLETED',
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!video) {
    notFound()
  }

  // Increment view count
  await prisma.video.update({
    where: { id: video.id },
    data: { views: { increment: 1 } },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Seedance</span>
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
          >
            Create Your Own
          </Link>
        </div>
      </header>

      {/* Video Player */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
          <video
            src={video.outputVideoKey!}
            controls
            autoPlay
            loop
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>By {video.user.name || 'Anonymous'}</span>
              <span>•</span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {video.views} views
              </span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Prompt</h3>
            <p className="text-sm text-muted-foreground">{video.prompt}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-medium">
                {video.generationType === 'TEXT_TO_VIDEO'
                  ? 'Text to Video'
                  : 'Image to Video'}
              </p>
            </div>
            {video.style && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Style</p>
                <p className="text-sm font-medium capitalize">{video.style}</p>
              </div>
            )}
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium">{video.duration}s</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Resolution</p>
              <p className="text-sm font-medium">{video.resolution}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-2">Create Your Own AI Videos</h3>
            <p className="text-muted-foreground mb-4">
              Transform text and images into stunning videos with AI
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
