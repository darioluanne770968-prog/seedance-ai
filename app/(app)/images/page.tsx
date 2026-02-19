'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Plus,
  Loader2,
  Download,
  Share2,
  Trash2,
  Eye
} from 'lucide-react'

interface ImageItem {
  id: string
  title: string
  prompt: string
  status: string
  outputImageKey: string | null
  width: number
  height: number
  createdAt: string
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images')
      const data = await res.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return

    try {
      await fetch(`/api/images/${id}`, { method: 'DELETE' })
      setImages(images.filter(img => img.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Images</h1>
            <p className="text-muted-foreground">{images.length} images created</p>
          </div>
          <Link
            href="/create/text-to-image"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Image
          </Link>
        </div>

        {/* Empty State */}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No images yet</h2>
            <p className="text-muted-foreground mb-6">Start creating amazing AI images</p>
            <Link
              href="/create/text-to-image"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your First Image
            </Link>
          </div>
        ) : (
          /* Image Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  {image.status === 'COMPLETED' && image.outputImageKey ? (
                    <img
                      src={image.outputImageKey}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : image.status === 'PROCESSING' ? (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-400" />
                        <span className="text-sm text-muted-foreground">Generating...</span>
                      </div>
                    </div>
                  ) : image.status === 'FAILED' ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-500/10">
                      <span className="text-sm text-red-400">Failed</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  {image.status === 'COMPLETED' && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Link
                        href={`/images/${image.id}`}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <a
                        href={image.outputImageKey!}
                        download
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 bg-white/20 hover:bg-red-500/50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{image.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{image.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Sparkles(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
