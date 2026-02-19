'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function HailuoAIPage() {
  return (
    <VideoGenerator
      title="Hailuo AI"
      description="Affordable AI video generation for everyone"
      defaultModel="hailuo-ai"
      modelInfo={{
        name: 'Hailuo AI',
        features: [
          'Most affordable option',
          'Good quality for the price',
          'Fast processing times',
          'Easy to use',
          'Great for beginners',
        ],
      }}
      tips={[
        'Perfect for learning and experimentation',
        'Use clear, simple prompts',
        'Great for personal projects',
        'Ideal for trying different ideas quickly',
      ]}
    />
  )
}
