'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'

interface DownloadButtonProps {
  videoId: string
  title: string
  className?: string
}

export function DownloadButton({ videoId, title, className = '' }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/videos/${videoId}/download`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Download failed')
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = data.url
      link.download = data.filename || `${title}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert(error instanceof Error ? error.message : 'Failed to download video')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={className}
    >
      {downloading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download</span>
        </>
      )}
    </button>
  )
}
