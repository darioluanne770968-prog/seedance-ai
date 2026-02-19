'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function KlingAIPage() {
  return (
    <VideoGenerator
      title="Kling AI"
      descriptionKey="klingai"
      defaultModel="kling-ai"
      modelKey="klingai"
      modelInfo={{
        name: 'Kling AI',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
