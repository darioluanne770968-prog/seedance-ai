'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Sora2Page() {
  return (
    <VideoGenerator
      title="Sora 2"
      descriptionKey="sora2"
      defaultModel="sora-2"
      modelKey="sora2"
      modelInfo={{
        name: 'Sora 2',
        tag: 'Hot',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
