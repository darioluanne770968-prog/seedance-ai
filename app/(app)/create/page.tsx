import Link from 'next/link'
import { Video, Image, Wand2, Sparkles, Zap, Music } from 'lucide-react'

const videoModels = [
  {
    id: 'seedance-2',
    name: 'Seedance 2.0',
    description: 'Next-generation video AI with enhanced quality',
    tag: 'New',
    tagColor: 'bg-green-500',
    credits: 150,
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-400',
    comingSoon: true,
  },
  {
    id: 'seedance-1.5-pro',
    name: 'Seedance 1.5 Pro',
    description: 'Our flagship model for professional videos',
    tag: 'Popular',
    tagColor: 'bg-blue-500',
    credits: 120,
    icon: Video,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'sora-2',
    name: 'Sora 2',
    description: 'OpenAI\'s advanced video generation',
    tag: 'Hot',
    tagColor: 'bg-red-500',
    credits: 200,
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'veo-3',
    name: 'Veo 3',
    description: 'Google\'s powerful video AI',
    credits: 180,
    icon: Video,
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    id: 'wan-2.5',
    name: 'Wan 2.5',
    description: 'Video generation with audio support',
    tag: 'Audio',
    tagColor: 'bg-purple-500',
    credits: 100,
    icon: Music,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'kling-ai',
    name: 'Kling AI',
    description: 'Fast and efficient video generation',
    credits: 80,
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-400',
  },
  {
    id: 'hailuo-ai',
    name: 'Hailuo AI',
    description: 'Affordable AI video for everyone',
    credits: 60,
    icon: Video,
    gradient: 'from-teal-500 to-cyan-400',
  },
]

const quickActions = [
  {
    name: 'Text to Video',
    description: 'Generate videos from text descriptions',
    href: '/create/text-to-video',
    icon: Video,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Image to Video',
    description: 'Bring your images to life with AI',
    href: '/create/image-to-video',
    icon: Image,
    gradient: 'from-pink-500 to-orange-500',
  },
  {
    name: 'AI Image Generator',
    description: 'Create stunning images with AI',
    href: '/create/ai-image',
    icon: Wand2,
    gradient: 'from-blue-500 to-purple-500',
  },
]

export default function CreatePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create with AI</h1>
          <p className="text-muted-foreground">
            Choose a model or tool to start creating
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-white transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Video AI Models */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Video AI Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoModels.map((model) => {
              const Icon = model.icon
              return (
                <Link
                  key={model.id}
                  href={`/create/${model.id}`}
                  className={`group relative p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all ${model.comingSoon ? 'opacity-70' : ''}`}
                >
                  {/* Tag */}
                  {model.tag && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs ${model.tagColor} text-white rounded`}>
                      {model.tag}
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${model.gradient} rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 group-hover:text-white transition-colors">
                        {model.name}
                        {model.comingSoon && (
                          <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {model.description}
                      </p>
                      <div className="flex items-center text-xs">
                        <span className="text-yellow-400 font-medium">{model.credits} credits</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl">
          <h3 className="font-semibold mb-3">Pro Tips</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
              <span>Use detailed prompts for better results</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
              <span>Start with lower resolution to test ideas</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
              <span>Different models excel at different styles</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></span>
              <span>Use Wan 2.5 for videos with audio</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
