'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  Download,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Loader2
} from 'lucide-react'

interface VideoClip {
  id: string
  file: File
  url: string
  duration: number
  startTime: number
  endTime: number
}

export default function VideoEditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [clips, setClips] = useState<VideoClip[]>([])
  const [currentClipIndex, setCurrentClipIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [exporting, setExporting] = useState(false)

  const currentClip = clips[currentClipIndex]

  useEffect(() => {
    if (videoRef.current && currentClip) {
      videoRef.current.src = currentClip.url
      videoRef.current.load()
    }
  }, [currentClipIndex, clips])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      if (!file.type.startsWith('video/')) continue

      const url = URL.createObjectURL(file)

      // Get video duration
      const video = document.createElement('video')
      video.src = url
      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })

      const newClip: VideoClip = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        url,
        duration: video.duration,
        startTime: 0,
        endTime: video.duration,
      }

      setClips(prev => [...prev, newClip])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const removeClip = (index: number) => {
    URL.revokeObjectURL(clips[index].url)
    setClips(prev => prev.filter((_, i) => i !== index))
    if (currentClipIndex >= clips.length - 1) {
      setCurrentClipIndex(Math.max(0, clips.length - 2))
    }
  }

  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setTrimStart(Math.min(value, trimEnd - 1))
    } else {
      setTrimEnd(Math.max(value, trimStart + 1))
    }
  }

  const applyTrim = () => {
    if (!currentClip) return

    const trimmedStartTime = (trimStart / 100) * currentClip.duration
    const trimmedEndTime = (trimEnd / 100) * currentClip.duration

    setClips(prev => prev.map((clip, i) =>
      i === currentClipIndex
        ? { ...clip, startTime: trimmedStartTime, endTime: trimmedEndTime }
        : clip
    ))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleExport = async () => {
    setExporting(true)

    // In production, this would use FFmpeg.wasm or server-side processing
    // For now, we'll just download the current clip
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (currentClip) {
      const a = document.createElement('a')
      a.href = currentClip.url
      a.download = `edited-${currentClip.file.name}`
      a.click()
    }

    setExporting(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-semibold">Video Editor</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Clip
            </button>
            <button
              onClick={handleExport}
              disabled={clips.length === 0 || exporting}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Preview */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 flex items-center justify-center bg-black p-4">
            {currentClip ? (
              <video
                ref={videoRef}
                className="max-w-full max-h-full"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-16 text-center cursor-pointer hover:border-white/40 transition-colors"
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Upload a video to start editing</p>
                <p className="text-sm text-muted-foreground">
                  Click or drag videos here
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          {currentClip && (
            <div className="p-4 border-t border-white/10">
              {/* Time Display */}
              <div className="text-center mb-4 text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => seekTo(Math.max(0, currentTime - 10))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <div className="border-l border-white/10 h-8 mx-2" />

                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Clips & Tools */}
        <div className="w-80 border-l border-white/10 flex flex-col">
          {/* Trim Tool */}
          {currentClip && (
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium mb-3 flex items-center">
                <Scissors className="w-4 h-4 mr-2" />
                Trim
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Start: {Math.round(trimStart)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="99"
                    value={trimStart}
                    onChange={(e) => handleTrimChange('start', parseInt(e.target.value))}
                    className="w-full accent-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End: {Math.round(trimEnd)}%</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={trimEnd}
                    onChange={(e) => handleTrimChange('end', parseInt(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
                <button
                  onClick={applyTrim}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  Apply Trim
                </button>
              </div>
            </div>
          )}

          {/* Clips List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-medium mb-3">Clips ({clips.length})</h3>
            <div className="space-y-2">
              {clips.map((clip, index) => (
                <div
                  key={clip.id}
                  onClick={() => setCurrentClipIndex(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentClipIndex
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium truncate">{clip.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(clip.endTime - clip.startTime)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeClip(index)
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}

              {clips.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No clips added yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
