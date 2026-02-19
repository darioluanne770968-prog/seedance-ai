'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function KlingAIPage() {
  return (
    <VideoGenerator
      title="Kling AI"
      description="Fast and efficient video generation"
      defaultModel="kling-ai"
      modelInfo={{
        name: 'Kling AI',
        features: [
          'Rapid video generation',
          'Cost-effective processing',
          'Good for quick iterations',
          'Consistent style output',
          'Optimized for social media formats',
        ],
      }}
      tips={[
        'Great for quick prototypes and drafts',
        'Works well with simple, clear prompts',
        'Ideal for social media content',
        'Good balance of speed and quality',
      ]}
    />
  )
}
