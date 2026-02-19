'use client'

import { useState } from 'react'
import {
  Wand2,
  Sparkles,
  Camera,
  Shuffle,
  Copy,
  Check,
  Loader2,
  Video,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react'

const MODES = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Wand2,
    description: 'Simple prompt enhancement',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Sparkles,
    description: 'Detailed, cinematic prompts',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'camera',
    name: 'Camera Motion',
    icon: Camera,
    description: 'Add camera movements',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'transform',
    name: 'Transform',
    icon: Shuffle,
    description: 'Style transformation',
    color: 'from-green-500 to-emerald-500',
  },
]

const CAMERA_MOVEMENTS = [
  'Slow dolly in',
  'Slow dolly out',
  'Pan left to right',
  'Pan right to left',
  'Tilt up',
  'Tilt down',
  'Crane shot rising',
  'Crane shot descending',
  'Tracking shot',
  'Orbit around subject',
  'Push in',
  'Pull out',
  'Handheld shake',
  'Steadicam smooth',
]

const STYLES = [
  'Cinematic',
  'Anime',
  'Photorealistic',
  'Oil painting',
  'Watercolor',
  'Cyberpunk',
  'Fantasy',
  'Noir',
  'Vintage film',
  'Documentary',
  'Music video',
  'Commercial',
]

const LIGHTING = [
  'Golden hour',
  'Blue hour',
  'Dramatic shadows',
  'Soft diffused',
  'Neon lights',
  'Natural daylight',
  'Moonlight',
  'Studio lighting',
  'Backlit',
  'Rim lighting',
]

export default function PromptGeneratorPage() {
  const [mode, setMode] = useState('basic')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mode-specific settings
  const [cameraMovement, setCameraMovement] = useState('')
  const [style, setStyle] = useState('')
  const [lighting, setLighting] = useState('')
  const [targetStyle, setTargetStyle] = useState('')

  const generatePrompt = async () => {
    if (!input.trim()) return

    setLoading(true)

    // Simulate AI processing (in production, call an API)
    await new Promise(resolve => setTimeout(resolve, 1000))

    let generatedPrompt = ''

    switch (mode) {
      case 'basic':
        generatedPrompt = enhanceBasic(input)
        break
      case 'advanced':
        generatedPrompt = enhanceAdvanced(input, style, lighting)
        break
      case 'camera':
        generatedPrompt = addCameraMotion(input, cameraMovement)
        break
      case 'transform':
        generatedPrompt = transformStyle(input, targetStyle)
        break
    }

    setOutput(generatedPrompt)
    setLoading(false)
  }

  const enhanceBasic = (text: string) => {
    const enhancements = [
      'high quality',
      'detailed',
      'professional',
      '4K resolution',
    ]
    return `${text}, ${enhancements.join(', ')}`
  }

  const enhanceAdvanced = (text: string, style: string, lighting: string) => {
    const parts = [text]
    if (style) parts.push(`${style} style`)
    if (lighting) parts.push(`${lighting} lighting`)
    parts.push('cinematic composition')
    parts.push('professional color grading')
    parts.push('8K resolution')
    parts.push('masterpiece quality')
    parts.push('highly detailed')
    return parts.join(', ')
  }

  const addCameraMotion = (text: string, motion: string) => {
    if (!motion) motion = 'Slow dolly in'
    return `${motion}: ${text}. Smooth motion, professional cinematography, steady camera movement, high frame rate`
  }

  const transformStyle = (text: string, target: string) => {
    if (!target) target = 'Cinematic'
    return `Transform to ${target} style: ${text}. Maintain core elements while applying ${target.toLowerCase()} aesthetic, professional quality, cohesive visual style`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentMode = MODES.find(m => m.id === mode)!

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${currentMode.color} rounded-xl flex items-center justify-center`}>
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Prompt Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Enhance your prompts with AI-powered suggestions
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-xl border transition-all text-left ${
                mode === m.id
                  ? `border-white/30 bg-gradient-to-br ${m.color} bg-opacity-20`
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <m.icon className={`w-6 h-6 mb-2 ${mode === m.id ? 'text-white' : 'text-muted-foreground'}`} />
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.description}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Idea</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your video or image idea..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Mode-specific options */}
            {mode === 'advanced' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.slice(0, 6).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStyle(style === s ? '' : s)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          style === s
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lighting</label>
                  <div className="flex flex-wrap gap-2">
                    {LIGHTING.slice(0, 5).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLighting(lighting === l ? '' : l)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          lighting === l
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'camera' && (
              <div>
                <label className="block text-sm font-medium mb-2">Camera Movement</label>
                <select
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select movement...</option>
                  {CAMERA_MOVEMENTS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'transform' && (
              <div>
                <label className="block text-sm font-medium mb-2">Target Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTargetStyle(targetStyle === s ? '' : s)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        targetStyle === s
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generatePrompt}
              disabled={loading || !input.trim()}
              className={`w-full py-4 bg-gradient-to-r ${currentMode.color} rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Prompt
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Enhanced Prompt</label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="min-h-[200px] p-4 bg-white/5 border border-white/10 rounded-xl">
              {output ? (
                <p className="text-sm leading-relaxed">{output}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your enhanced prompt will appear here...
                </p>
              )}
            </div>

            {/* Quick Actions */}
            {output && (
              <div className="mt-4 flex space-x-3">
                <a
                  href={`/create/text-to-video?prompt=${encodeURIComponent(output)}`}
                  className="flex-1 flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Create Video
                </a>
                <a
                  href={`/create/text-to-image?prompt=${encodeURIComponent(output)}`}
                  className="flex-1 flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Image
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
