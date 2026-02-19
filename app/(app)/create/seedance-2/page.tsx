'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Seedance2Page() {
  return (
    <VideoGenerator
      title="Seedance 2.0"
      description="Our next-generation AI video model (Coming Soon)"
      defaultModel="seedance-1.5-pro"
      modelInfo={{
        name: 'Seedance 2.0',
        tag: 'New',
        features: [
          'Next-generation video quality',
          'Enhanced motion coherence',
          'Longer video support up to 30 seconds',
          'Advanced style transfer',
          'Real-time preview (coming soon)',
        ],
      }}
      tips={[
        'Seedance 2.0 is currently in preview',
        'Using Seedance 1.5 Pro in the meantime',
        'Stay tuned for the full release',
        'Premium features will be available soon',
      ]}
    />
  )
}
