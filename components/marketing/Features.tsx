'use client'

import { FileText, Image, Palette, Zap, Video, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Features() {
  const t = useTranslations('home.features')

  const features = [
    {
      icon: FileText,
      titleKey: 'textToVideo.title',
      descKey: 'textToVideo.description',
    },
    {
      icon: Image,
      titleKey: 'imageToVideo.title',
      descKey: 'imageToVideo.description',
    },
    {
      icon: Palette,
      titleKey: 'multipleModels.title',
      descKey: 'multipleModels.description',
    },
    {
      icon: Zap,
      title: 'Fast Generation',
      desc: 'Powerful AI engine for quick processing. Usually completes 5-second videos in 30 seconds.',
    },
    {
      icon: Video,
      title: 'HD Quality',
      desc: 'Support 720p, 1080p, even 4K resolution. Smooth 24fps or 30fps frame rate.',
    },
    {
      icon: Sparkles,
      title: 'Smart Understanding',
      desc: 'Advanced semantic understanding and prompt following. Precisely realize your creative vision.',
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('title')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">
                {feature.titleKey ? t(feature.titleKey) : feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.descKey ? t(feature.descKey) : feature.desc}
              </p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-xl transition-all duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
