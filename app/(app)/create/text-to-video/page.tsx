'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Sparkles, Volume2, VolumeX, Play } from 'lucide-react'

const AI_MODELS = [
  { id: 'seedance-2.0', name: 'Seedance 2.0', tag: 'New', credits: 150, comingSoon: true },
  { id: 'seedance-1.5-pro', name: 'Seedance 1.5 Pro', tag: 'New', credits: 120 },
  { id: 'sora-2', name: 'Sora 2', tag: 'Hot', credits: 200 },
  { id: 'veo-3', name: 'Veo 3', credits: 180 },
  { id: 'wan-2.5', name: 'Wan 2.5', tag: 'Audio', credits: 100 },
  { id: 'kling-ai', name: 'Kling AI', credits: 80 },
  { id: 'hailuo-ai', name: 'Hailuo AI', credits: 60 },
]

const RESOLUTIONS = [
  { value: '480p', label: '480P' },
  { value: '720p', label: '720P' },
  { value: '1080p', label: '1080P', premium: true },
]

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '21:9', label: '21:9' },
]

const DURATIONS = [
  { value: 5, label: '5s' },
  { value: 6, label: '6s' },
  { value: 10, label: '10s' },
  { value: 12, label: '12s' },
]

export default function TextToVideoPage() {
  const router = useRouter()
  const t = useTranslations('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(true)

  const [formData, setFormData] = useState({
    model: 'seedance-1.5-pro',
    prompt: '',
    resolution: '720p',
    aspectRatio: '16:9',
    duration: 5,
  })

  const selectedModel = AI_MODELS.find((m) => m.id === formData.model)
  const creditsRequired = selectedModel?.credits || 120

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationType: 'TEXT_TO_VIDEO',
          prompt: formData.prompt,
          aiModel: formData.model,
          resolution: formData.resolution,
          aspectRatio: formData.aspectRatio,
          duration: formData.duration,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      router.push('/videos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-104px)]">
      {/* Center - Form */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">{t('textToVideo')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('textToVideoFullDesc')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('model.label')}</label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AI_MODELS.map((model) => (
                  <option
                    key={model.id}
                    value={model.id}
                    disabled={model.comingSoon}
                  >
                    {model.name} {model.tag && `(${model.tag})`} {model.comingSoon && `- ${t('comingSoon')}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('prompt.required')}
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder={t('prompt.placeholder')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-28 resize-none"
                maxLength={2000}
                required
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">
                  {formData.prompt.length} / 2000
                </span>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('resolution.label')}</label>
              <div className="flex gap-2">
                {RESOLUTIONS.map((res) => (
                  <button
                    key={res.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, resolution: res.value })}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                      formData.resolution === res.value
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {res.label}
                    {res.premium && <span className="ml-1 text-yellow-400">⭐</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('aspectRatio.label')}</label>
              <select
                value={formData.aspectRatio}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ASPECT_RATIOS.map((ratio) => (
                  <option key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('duration.label')}</label>
              <div className="flex gap-2">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: dur.value })}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                      formData.duration === dur.value
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Credits Required */}
            <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg">
              <span className="text-sm text-muted-foreground">{t('creditsRequired')}</span>
              <span className="font-semibold text-yellow-400">{creditsRequired}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('creating')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t('create')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Preview */}
      <div className="hidden lg:block w-[500px] border-l border-white/10 p-6 bg-black/20">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{t('sampleVideo')}</h2>
          <p className="text-xs text-muted-foreground">
            ({t('createdResults')})
          </p>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl overflow-hidden">
          <video
            src="/demo-video.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
          />

          {/* Mute Toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="absolute top-3 right-3 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Placeholder if no video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-blue-900/80">
            <div className="text-center">
              <Play className="w-16 h-16 mx-auto mb-4 text-white/50" />
              <p className="text-sm text-white/50">{t('previewHere')}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h3 className="font-medium mb-2">{t('tips')}</h3>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li>• {t('textToVideoTips.tip1')}</li>
            <li>• {t('textToVideoTips.tip2')}</li>
            <li>• {t('textToVideoTips.tip3')}</li>
            <li>• {t('textToVideoTips.tip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
