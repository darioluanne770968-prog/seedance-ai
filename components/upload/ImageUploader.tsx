'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  value?: string
}

export function ImageUploader({ onUpload, value }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(value || '')

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setError('')
      setUploading(true)

      try {
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload file
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        onUpload(data.url)
      } catch (err: any) {
        setError(err.message || 'Failed to upload image')
        setPreview('')
      } finally {
        setUploading(false)
      }
    },
    [onUpload]
  )

  const handleRemove = () => {
    setPreview('')
    onUpload('')
  }

  return (
    <div>
      {preview ? (
        <div className="relative aspect-video bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-contain"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="aspect-video flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP or GIF (max 10MB)
              </p>
            </>
          )}
        </label>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
