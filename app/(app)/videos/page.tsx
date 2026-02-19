import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VideoProgress } from '@/components/video/VideoProgress'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function VideosPage() {
  const session = await auth()

  const videos = await prisma.video.findMany({
    where: {
      userId: session!.user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Videos</h1>
          <p className="text-muted-foreground">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} created
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Video
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first AI-generated video
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoProgress key={video.id} initialVideo={video} />
          ))}
        </div>
      )}
    </div>
  )
}
