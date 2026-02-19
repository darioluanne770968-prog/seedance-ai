'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Video,
  Upload,
  Sparkles,
  Loader2,
  Play,
  X,
  Wand2,
  Film,
  Palette,
  Zap
} from 'lucide-react'

const STYLES = [
  { id: 'enhance', name: 'Enhance', icon: Zap, description: 'Improve quality and details' },
  { id: 'anime', name: 'Anime', icon: Palette, description: 'Convert to anime style' },
  { id: 'cinematic', name: 'Cinematic', icon: Film, description: 'Add cinematic look' },
  { id: 'artistic', name: 'Artistic', icon: Wand2, description: 'Apply artistic effects' },
]

export default function VideoToVideoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('enhance')
  const [strength, setStrength] = useState(0.5)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, WebM, or MOV)')
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError('Video file must be less than 100MB')
      return
    }

    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleGenerate = async () => {
    if (!videoFile) {
      setError('Please upload a video first')
      return
    }

    setLoading(true)
    setUploading(true)
    setError('')

    try {
      // Upload video first
      const formData = new FormData()
      formData.append('file', videoFile)
      formData.append('type', 'video')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload video')
      }

      const { url: videoUrl } = await uploadRes.json()
      setUploading(false)

      // Generate video-to-video
      const res = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationType: 'VIDEO_TO_VIDEO',
          prompt: prompt || `Transform video with ${style} style`,
          sourceVideoUrl: videoUrl,
          style,
          strength,
          title: `${style.charAt(0).toUpperCase() + style.slice(1)} Video`,
          aiModel: 'video-to-video',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      router.push(`/videos/${data.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Video to Video</h1>
          </div>
          <p className="text-muted-foreground">
            Transform your videos with AI - enhance quality, change style, or apply artistic effects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Video Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Source Video</label>

              {!videoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM, MOV up to 100MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full aspect-video object-contain"
                  />
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Transformation Prompt (Optional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to transform the video..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Right: Settings */}
          <div className="space-y-6">
            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Style</label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      style === s.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <s.icon className={`w-5 h-5 mb-2 ${style === s.id ? 'text-purple-400' : 'text-muted-foreground'}`} />
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Strength Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Transformation Strength</label>
                <span className="text-sm text-muted-foreground">{Math.round(strength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Subtle</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!videoFile || loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {uploading ? 'Uploading...' : 'Transforming...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Transform Video
                </>
              )}
            </button>

            {/* Credits Info */}
            <p className="text-xs text-center text-muted-foreground">
              This will use approximately 200 credits
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
