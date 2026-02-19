'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  videoId: string
  videoTitle: string
  className?: string
  onDeleted?: () => void
}

export function DeleteButton({
  videoId,
  videoTitle,
  className = '',
  onDeleted,
}: DeleteButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delete failed')
      }

      // Call callback or refresh
      if (onDeleted) {
        onDeleted()
      } else {
        router.push('/videos')
        router.refresh()
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete video')
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background border border-white/10 rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-2">Delete Video?</h3>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete "{videoTitle}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className={className}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}
