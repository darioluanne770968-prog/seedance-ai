'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wand2,
  Upload,
  Sparkles,
  Loader2,
  X,
  Film,
  Palette,
  Sun,
  Moon,
  Zap,
  Waves,
  Flame,
  Snowflake
} from 'lucide-react'

const EFFECTS = [
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    icon: Film,
    description: 'Smooth slow-motion effect',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'color-grade',
    name: 'Color Grade',
    icon: Palette,
    description: 'Cinematic color grading',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'day-to-night',
    name: 'Day to Night',
    icon: Moon,
    description: 'Transform daytime to night',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'night-to-day',
    name: 'Night to Day',
    icon: Sun,
    description: 'Transform night to daytime',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'stabilize',
    name: 'Stabilize',
    icon: Waves,
    description: 'Remove camera shake',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'enhance',
    name: 'AI Enhance',
    icon: Zap,
    description: 'Upscale and enhance quality',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'warm',
    name: 'Warm Tones',
    icon: Flame,
    description: 'Add warm color temperature',
    color: 'from-orange-400 to-yellow-400',
  },
  {
    id: 'cool',
    name: 'Cool Tones',
    icon: Snowflake,
    description: 'Add cool color temperature',
    color: 'from-cyan-400 to-blue-400',
  },
]

export default function VideoEffectsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [selectedEffects, setSelectedEffects] = useState<string[]>([])
  const [intensity, setIntensity] = useState(0.5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be less than 100MB')
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
  }

  const toggleEffect = (effectId: string) => {
    setSelectedEffects(prev =>
      prev.includes(effectId)
        ? prev.filter(e => e !== effectId)
        : [...prev, effectId]
    )
  }

  const handleApply = async () => {
    if (!videoFile || selectedEffects.length === 0) {
      setError('Please upload a video and select at least one effect')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Upload video
      const formData = new FormData()
      formData.append('file', videoFile)
      formData.append('type', 'video')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      const { url: videoUrl } = await uploadRes.json()

      // Apply effects
      const res = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationType: 'VIDEO_EFFECTS',
          prompt: `Apply effects: ${selectedEffects.join(', ')}`,
          sourceVideoUrl: videoUrl,
          effects: selectedEffects,
          intensity,
          title: `Video with ${selectedEffects[0]} effect`,
          aiModel: 'video-effects',
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed')

      router.push(`/videos/${data.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">AI Video Effects</h1>
          </div>
          <p className="text-muted-foreground">
            Apply stunning AI-powered effects to your videos
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
                  className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Click to upload your video
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM up to 100MB
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
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Intensity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Effect Intensity</label>
                <span className="text-sm text-muted-foreground">{Math.round(intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={!videoFile || selectedEffects.length === 0 || loading}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl font-medium hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Apply Effects ({selectedEffects.length})
                </>
              )}
            </button>
          </div>

          {/* Right: Effects Grid */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Select Effects ({selectedEffects.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EFFECTS.map((effect) => {
                const isSelected = selectedEffects.includes(effect.id)
                return (
                  <button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? `border-white/30 bg-gradient-to-br ${effect.color} bg-opacity-20`
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <effect.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                    <div className="font-medium text-sm">{effect.name}</div>
                    <div className="text-xs text-muted-foreground">{effect.description}</div>
                  </button>
                )
              })}
            </div>

            {/* Selected Effects Preview */}
            {selectedEffects.length > 0 && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <div className="text-sm font-medium mb-2">Applied Effects:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedEffects.map((id) => {
                    const effect = EFFECTS.find(e => e.id === id)!
                    return (
                      <span
                        key={id}
                        className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${effect.color} text-white`}
                      >
                        {effect.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Credits Info */}
            <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-sm text-muted-foreground">
                <span className="text-violet-400 font-medium">~50 credits</span> per effect applied
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
