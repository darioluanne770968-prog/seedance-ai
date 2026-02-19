'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Sora2Page() {
  return (
    <VideoGenerator
      title="Sora 2"
      description="OpenAI's most advanced video generation model"
      defaultModel="sora-2"
      modelInfo={{
        name: 'Sora 2',
        tag: 'Hot',
        features: [
          'State-of-the-art video quality',
          'Complex scene understanding',
          'Realistic physics simulation',
          'Multiple subjects and interactions',
          'Extended duration support',
        ],
      }}
      tips={[
        'Describe detailed scenes with multiple elements',
        'Include physical interactions for realistic results',
        'Specify camera movements for cinematic effects',
        'Use longer durations for complex narratives',
      ]}
    />
  )
}
