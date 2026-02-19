'use client'

import { useState } from 'react'
import { Navbar } from './Navbar'
import { AppSidebar } from './AppSidebar'

interface AppLayoutClientProps {
  children: React.ReactNode
}

export function AppLayoutClient({ children }: AppLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar */}
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-0' : 'ml-64'
          }`}
          style={{ marginTop: '104px' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
