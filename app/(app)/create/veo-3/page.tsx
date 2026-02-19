'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Veo3Page() {
  return (
    <VideoGenerator
      title="Veo 3"
      description="Google's powerful video generation AI"
      defaultModel="veo-3"
      modelInfo={{
        name: 'Veo 3',
        features: [
          'Photorealistic video generation',
          'Advanced temporal consistency',
          'Diverse style capabilities',
          'Optimized for long-form content',
          'Excellent color accuracy',
        ],
      }}
      tips={[
        'Best for realistic and documentary-style videos',
        'Excels at natural landscapes and environments',
        'Include lighting details for best results',
        'Works well with atmospheric descriptions',
      ]}
    />
  )
}
