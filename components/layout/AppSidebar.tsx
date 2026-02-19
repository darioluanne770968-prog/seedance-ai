'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Video, Image, Wand2, Layers, FolderOpen,
  ChevronLeft, Sparkles, TrendingUp, Scissors,
  PenTool, Zap, Film, Globe
} from 'lucide-react'

const menuItems = [
  {
    category: 'Video AI',
    items: [
      { name: 'Text to Video', href: '/create/text-to-video', icon: Video },
      { name: 'Image to Video', href: '/create/image-to-video', icon: Image },
      { name: 'Video to Video', href: '/create/video-to-video', icon: Film, tag: 'New', tagColor: 'bg-blue-500' },
      { name: 'Video Effects', href: '/create/video-effects', icon: Zap },
    ],
  },
  {
    category: 'Image AI',
    items: [
      { name: 'Text to Image', href: '/create/text-to-image', icon: Wand2, tag: 'New', tagColor: 'bg-purple-500' },
      { name: 'AI Image Generator', href: '/create/ai-image', icon: Wand2 },
      { name: 'Image to Image AI', href: '/create/image-to-image', icon: Image },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Prompt Generator', href: '/tools/prompt-generator', icon: PenTool },
      { name: 'Video Editor', href: '/tools/video-editor', icon: Scissors },
    ],
  },
  {
    category: 'AI Models',
    items: [
      { name: 'Nano Banana Pro', href: '/create/nano-banana-pro', icon: Sparkles, tag: 'New', tagColor: 'bg-green-500' },
      { name: 'Wan 2.5', href: '/create/wan-2.5', icon: Video, tag: 'Audio', tagColor: 'bg-purple-500' },
      { name: 'More AI Models', href: '/models', icon: Layers },
    ],
  },
]

interface AppSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function AppSidebar({ collapsed = false, onToggle }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`fixed left-0 top-[104px] h-[calc(100vh-104px)] bg-background border-r border-white/10 transition-all duration-300 z-40 ${
      collapsed ? 'w-0 overflow-hidden' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 w-6 h-6 bg-background border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Logo/Brand */}
        <div className="px-4 py-4 border-b border-white/10">
          <Link href="/create" className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">Seedance AI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((section) => (
            <div key={section.category} className="mb-6">
              <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section.category}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/10 text-foreground'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="flex-1">{item.name}</span>
                      {item.tag && (
                        <span className={`px-1.5 py-0.5 text-[10px] ${item.tagColor} text-white rounded`}>
                          {item.tag}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {/* My Creations */}
          <div className="mb-6">
            <Link
              href="/videos"
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                pathname === '/videos'
                  ? 'bg-white/10 text-foreground'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-3" />
              <span>My Creations</span>
            </Link>
          </div>

          {/* Community */}
          <div className="mb-6">
            <Link
              href="/showcase"
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                pathname === '/showcase'
                  ? 'bg-white/10 text-foreground'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <Globe className="w-4 h-4 mr-3" />
              <span>Community Showcase</span>
            </Link>
          </div>
        </nav>

        {/* Upgrade Button */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/pricing"
            className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-500 transition-all"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade Now
          </Link>
        </div>
      </div>
    </aside>
  )
}
