'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Veo3Page() {
  return (
    <VideoGenerator
      title="Veo 3"
      descriptionKey="veo3"
      defaultModel="veo-3"
      modelKey="veo3"
      modelInfo={{
        name: 'Veo 3',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
