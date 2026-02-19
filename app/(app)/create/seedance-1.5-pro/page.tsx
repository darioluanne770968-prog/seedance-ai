'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Seedance15ProPage() {
  return (
    <VideoGenerator
      title="Seedance 1.5 Pro"
      descriptionKey="seedance15pro"
      defaultModel="seedance-1.5-pro"
      modelKey="seedance15pro"
      modelInfo={{
        name: 'Seedance 1.5 Pro',
        tag: 'New',
        featureCount: 5,
      }}
    />
  )
}
