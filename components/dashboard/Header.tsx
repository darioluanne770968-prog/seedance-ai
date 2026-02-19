'use client'

import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-xl px-6 md:ml-64">
      <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold">
          Welcome back, {user.name?.split(' ')[0] || 'there'}!
        </h1>
      </div>

      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
      </button>
    </header>
  )
}
