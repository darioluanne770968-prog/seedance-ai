'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Settings2,
  Wand2,
  Square,
  RectangleHorizontal,
  RectangleVertical
} from 'lucide-react'

const AI_MODELS = [
  { id: 'sdxl', name: 'Stable Diffusion XL', description: 'High quality, versatile' },
  { id: 'flux', name: 'Flux', description: 'Fast, creative' },
  { id: 'dalle-3', name: 'DALL-E 3', description: 'Best for text rendering' },
  { id: 'midjourney', name: 'Midjourney Style', description: 'Artistic, stylized' },
  { id: 'ideogram', name: 'Ideogram', description: 'Excellent text in images' },
]

const STYLES = [
  'Photorealistic',
  'Digital Art',
  'Anime',
  'Oil Painting',
  'Watercolor',
  'Sketch',
  '3D Render',
  'Pop Art',
  'Minimalist',
  'Cyberpunk',
]

const ASPECT_RATIOS = [
  { id: '1:1', icon: Square, width: 1024, height: 1024 },
  { id: '16:9', icon: RectangleHorizontal, width: 1344, height: 768 },
  { id: '9:16', icon: RectangleVertical, width: 768, height: 1344 },
  { id: '4:3', icon: RectangleHorizontal, width: 1152, height: 896 },
  { id: '3:4', icon: RectangleVertical, width: 896, height: 1152 },
]

export default function TextToImagePage() {
  const router = useRouter()

  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('sdxl')
  const [style, setStyle] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedAspect = ASPECT_RATIOS.find(ar => ar.id === aspectRatio)!

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')

    try {
      const fullPrompt = style ? `${prompt}, ${style} style` : prompt

      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          negativePrompt,
          model,
          width: selectedAspect.width,
          height: selectedAspect.height,
          title: prompt.slice(0, 50),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      router.push(`/images/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Text to Image</h1>
          </div>
          <p className="text-muted-foreground">
            Create stunning images from text descriptions using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene Japanese garden with cherry blossoms, golden hour lighting, highly detailed..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>

            {/* Style Chips */}
            <div>
              <label className="block text-sm font-medium mb-3">Style (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(style === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      style === s
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Advanced Settings
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Negative Prompt</label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Things to avoid: blurry, low quality, distorted..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-sm"
                    />
                  </div>
                </div>
              )}
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
              disabled={loading || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Right: Settings */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">AI Model</label>
              <div className="space-y-2">
                {AI_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      model === m.id
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium mb-3">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                      aspectRatio === ar.id
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <ar.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{ar.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm font-medium mb-2">Output Size</div>
              <div className="text-muted-foreground text-sm">
                {selectedAspect.width} x {selectedAspect.height} px
              </div>
            </div>

            {/* Credits Info */}
            <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20">
              <div className="flex items-center mb-2">
                <Wand2 className="w-4 h-4 mr-2 text-pink-400" />
                <span className="text-sm font-medium">Credit Cost</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ~10 credits per image
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
