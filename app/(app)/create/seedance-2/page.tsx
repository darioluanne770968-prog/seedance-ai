'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Seedance2Page() {
  return (
    <VideoGenerator
      title="Seedance 2.0"
      descriptionKey="seedance2"
      defaultModel="seedance-1.5-pro"
      modelKey="seedance2"
      modelInfo={{
        name: 'Seedance 2.0',
        tag: 'New',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
