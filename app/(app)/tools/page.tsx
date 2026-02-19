'use client'

import Link from 'next/link'
import {
  PenTool,
  Scissors,
  Wand2,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const tools = [
  {
    name: 'Prompt Generator',
    description: 'Generate creative prompts for AI video and image generation with 4 different modes',
    href: '/tools/prompt-generator',
    icon: PenTool,
    gradient: 'from-purple-500 to-pink-500',
    features: ['Basic mode', 'Advanced mode', 'Camera mode', 'Transform mode'],
  },
  {
    name: 'Video Editor',
    description: 'Edit your videos directly in the browser with trimming, cutting, and export features',
    href: '/tools/video-editor',
    icon: Scissors,
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Multi-clip timeline', 'Trim & cut', 'Preview & export'],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to enhance your AI video creation workflow
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                {tool.name}
              </h2>

              <p className="text-muted-foreground mb-4">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tool.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs bg-white/10 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm text-muted-foreground group-hover:text-white transition-colors">
                <span>Open Tool</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 mr-2" />
            More tools coming soon
          </div>
        </div>
      </div>
    </div>
  )
}
