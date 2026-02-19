'use client'

import { Share2, Check, X } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  videoId: string
  className?: string
}

export function ShareButton({ videoId, className = '' }: ShareButtonProps) {
  const [sharing, setSharing] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    setSharing(true)
    try {
      const response = await fetch(`/api/videos/${videoId}/share`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate share link')
      }

      setShareUrl(data.shareUrl)
      setShowDialog(true)
    } catch (error) {
      console.error('Share error:', error)
      alert(error instanceof Error ? error.message : 'Failed to share video')
    } finally {
      setSharing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  if (showDialog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-background border border-white/10 rounded-xl p-6 max-w-md mx-4 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Share Video</h3>
            <button
              onClick={() => setShowDialog(false)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Anyone with this link can view your video
          </p>

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <span>Copy</span>
              )}
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out my AI-generated video!`, '_blank')}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all text-sm"
            >
              Share on X
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-sm"
            >
              Share on Facebook
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className={className}
    >
      {sharing ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </>
      )}
    </button>
  )
}
