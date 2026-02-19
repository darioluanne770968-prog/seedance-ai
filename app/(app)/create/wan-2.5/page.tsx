'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Wan25Page() {
  return (
    <VideoGenerator
      title="Wan 2.5"
      descriptionKey="wan25"
      defaultModel="wan-2.5"
      modelKey="wan25"
      modelInfo={{
        name: 'Wan 2.5',
        tag: 'Audio',
        featureCount: 5,
      }}
      tipCount={4}
    />
  )
}
