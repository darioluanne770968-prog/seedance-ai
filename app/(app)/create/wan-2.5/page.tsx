'use client'

import { VideoGenerator } from '@/components/create/VideoGenerator'

export default function Wan25Page() {
  return (
    <VideoGenerator
      title="Wan 2.5"
      description="Video generation with synchronized audio"
      defaultModel="wan-2.5"
      modelInfo={{
        name: 'Wan 2.5',
        tag: 'Audio',
        features: [
          'Built-in audio generation',
          'Synchronized sound effects',
          'Background music support',
          'Voice-over capabilities',
          'Multi-language audio support',
        ],
      }}
      tips={[
        'Describe sounds and music in your prompt',
        'Specify ambient audio for better immersion',
        'Include dialogue descriptions for voice generation',
        'Best for videos that need sound effects',
      ]}
    />
  )
}
