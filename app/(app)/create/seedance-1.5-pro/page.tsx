'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Seedance15ProPage() {
  return (
    <VideoGenerator
      title="Seedance 1.5 Pro"
      description="Create professional AI videos with our flagship model"
      defaultModel="seedance-1.5-pro"
      modelInfo={{
        name: 'Seedance 1.5 Pro',
        tag: 'New',
        features: [
          'High-quality video generation up to 1080p',
          'Natural motion and fluid animations',
          'Excellent prompt understanding',
          'Fast generation speed',
          'Supports both text and image inputs',
        ],
      }}
    />
  )
}
