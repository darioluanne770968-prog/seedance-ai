'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function HailuoAIPage() {
  return (
    <VideoGenerator
      title="Hailuo AI"
      descriptionKey="hailuoai"
      defaultModel="hailuo-ai"
      modelKey="hailuoai"
      modelInfo={{
        name: 'Hailuo AI',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
