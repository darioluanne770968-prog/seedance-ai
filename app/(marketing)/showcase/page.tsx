'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Play,
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Loader2,
  Filter,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react'

interface ShowcaseItem {
  id: string
  title: string
  prompt: string
  outputVideoKey: string
  thumbnailKey: string | null
  views: number
  _count: {
    likes: number
    comments: number
  }
  user: {
    name: string | null
    avatar: string | null
  }
  createdAt: string
}

const FILTERS = [
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'latest', name: 'Latest', icon: Clock },
  { id: 'featured', name: 'Featured', icon: Star },
]

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('trending')

  useEffect(() => {
    fetchShowcase()
  }, [filter])

  const fetchShowcase = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/showcase?filter=${filter}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch showcase:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-purple-500/10 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community Showcase
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore amazing AI-generated videos created by our community
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center space-x-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  filter === f.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <f.icon className="w-4 h-4 mr-2" />
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No creations yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share your AI-generated masterpiece!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Start Creating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/share/${item.id}`}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-black">
                  {item.thumbnailKey ? (
                    <img
                      src={item.thumbnailKey}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : item.outputVideoKey ? (
                    <video
                      src={item.outputVideoKey}
                      className="w-full h-full object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium mb-1 truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground truncate mb-3">
                    {item.prompt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item._count.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {item._count.comments}
                      </span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center">
                      {item.user.avatar ? (
                        <img
                          src={item.user.avatar}
                          alt={item.user.name || 'User'}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
