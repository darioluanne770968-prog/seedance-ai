'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
  Play, ChevronDown, Video, Image, Wand2,
  CreditCard, User, LogOut, Menu, X, Layers, Coins, Globe
} from 'lucide-react'

const videoModels = [
  { name: 'Seedance 2.0', href: '/create/seedance-2', tag: 'New', tagColor: 'bg-green-500' },
  { name: 'Seedance 1.5 Pro', href: '/create/seedance-1.5-pro', tag: 'New', tagColor: 'bg-green-500' },
  { name: 'Sora 2', href: '/create/sora-2', tag: 'Hot', tagColor: 'bg-red-500' },
  { name: 'Veo 3', href: '/create/veo-3' },
  { name: 'Wan 2.5', href: '/create/wan-2.5', tag: 'Audio', tagColor: 'bg-purple-500' },
  { name: 'Kling AI', href: '/create/kling-ai' },
  { name: 'Hailuo AI', href: '/create/hailuo-ai' },
]

const imageModels = [
  { name: 'Nano Banana Pro', href: '/create/nano-banana-pro', tag: 'New', tagColor: 'bg-green-500' },
  { name: 'Seedream 4.0', href: '/create/seedream-4', tag: 'Hot', tagColor: 'bg-red-500' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [videoOpen, setVideoOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (session) {
      fetch('/api/user/credits')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setCredits(data.credits)
        })
        .catch(() => {})
    }
  }, [session])

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-center py-2 px-4 text-sm">
        <span className="mr-2">🎁</span>
        <span className="font-medium">Seedance 2.0 is now live! </span>
        <span className="hidden sm:inline">NEW YEAR SALE - Get 50% OFF Now </span>
        <Link href="/pricing" className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors">
          Grab Now
        </Link>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Seedance</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/create"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Try Seedance
              </Link>

              {/* Video AI Dropdown */}
              <div className="relative" onMouseEnter={() => setVideoOpen(true)} onMouseLeave={() => setVideoOpen(false)}>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <span>Video AI</span>
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">1.5 Pro</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {videoOpen && (
                  <div className="absolute top-full left-0 w-80 pt-2">
                    <div className="bg-background border border-white/10 rounded-xl shadow-2xl p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Link href="/create/text-to-video" className="group p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center mb-2">
                          <Video className="w-5 h-5 text-blue-400 mr-2" />
                          <span className="font-medium">Text to Video</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Turn ideas into AI videos</p>
                      </Link>
                      <Link href="/create/image-to-video" className="group p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center mb-2">
                          <Image className="w-5 h-5 text-pink-400 mr-2" />
                          <span className="font-medium">Image to Video</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Animate images with AI</p>
                      </Link>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs text-muted-foreground mb-3">Video Models</p>
                      <div className="flex flex-wrap gap-2">
                        {videoModels.map((model) => (
                          <Link
                            key={model.name}
                            href={model.href}
                            className="flex items-center px-2 py-1 text-xs rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <span>{model.name}</span>
                            {model.tag && (
                              <span className={`ml-1 px-1.5 py-0.5 ${model.tagColor} text-white rounded text-[10px]`}>
                                {model.tag}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image AI Dropdown */}
              <div className="relative" onMouseEnter={() => setImageOpen(true)} onMouseLeave={() => setImageOpen(false)}>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <span>Image AI</span>
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded">Nano</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {imageOpen && (
                  <div className="absolute top-full left-0 w-64 pt-2">
                    <div className="bg-background border border-white/10 rounded-xl shadow-2xl p-4">
                      <Link href="/create/ai-image" className="block p-3 rounded-lg hover:bg-white/5 transition-colors mb-2">
                        <div className="flex items-center mb-1">
                          <Wand2 className="w-5 h-5 text-purple-400 mr-2" />
                          <span className="font-medium">AI Image Generator</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Create images with AI</p>
                      </Link>
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-xs text-muted-foreground mb-2">Image Models</p>
                        <div className="space-y-1">
                          {imageModels.map((model) => (
                            <Link
                              key={model.name}
                              href={model.href}
                              className="flex items-center px-2 py-1 text-xs rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <span>{model.name}</span>
                              {model.tag && (
                                <span className={`ml-1 px-1.5 py-0.5 ${model.tagColor} text-white rounded text-[10px]`}>
                                  {model.tag}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Tools */}
              <Link
                href="/tools"
                className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Layers className="w-4 h-4 mr-1" />
                AI Tools
              </Link>

              {/* Community Showcase */}
              <Link
                href="/showcase"
                className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4 mr-1" />
                Showcase
              </Link>

              {/* Quick Model Links */}
              <Link
                href="/create/seedance-1.5-pro"
                className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Seedance 1.5 Pro</span>
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">New</span>
              </Link>

              <Link
                href="/create/seedance-2"
                className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Seedance 2.0</span>
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">New</span>
              </Link>

              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  {/* Credits Display */}
                  <Link
                    href="/account/billing"
                    className="hidden md:flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Coins className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-sm font-medium">{credits !== null ? credits : '...'}</span>
                  </Link>

                  {/* User Menu */}
                  <div className="relative" onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
                    <button className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                      </div>
                    </button>

                    {userOpen && (
                      <div className="absolute top-full right-0 w-48 pt-2">
                        <div className="bg-background border border-white/10 rounded-xl shadow-2xl p-2">
                          <div className="px-3 py-2 border-b border-white/10 mb-2">
                            <p className="text-sm font-medium truncate">{session.user?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                          </div>
                          <Link href="/videos" className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors">
                            <Video className="w-4 h-4 mr-2" />
                            My Creations
                          </Link>
                          <Link href="/account" className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors">
                            <User className="w-4 h-4 mr-2" />
                            Account
                          </Link>
                          <Link href="/account/billing" className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Billing
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-500 transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-background">
            <div className="px-4 py-4 space-y-2">
              <Link href="/create" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Try Seedance</Link>
              <Link href="/create/text-to-video" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Text to Video</Link>
              <Link href="/create/image-to-video" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Image to Video</Link>
              <Link href="/showcase" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Showcase</Link>
              <Link href="/pricing" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Pricing</Link>
              {session && (
                <>
                  <Link href="/videos" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>My Creations</Link>
                  <Link href="/account" className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
