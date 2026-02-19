'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Video,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  Loader2
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  newUsersToday: number
  totalVideos: number
  videosToday: number
  activeSubscriptions: number
  revenue: number
  processingVideos: number
  failedVideos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersToday || 0} today`,
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      name: 'Total Videos',
      value: stats?.totalVideos || 0,
      change: `+${stats?.videosToday || 0} today`,
      icon: Video,
      color: 'from-purple-500 to-pink-400',
    },
    {
      name: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      change: 'Paid plans',
      icon: CreditCard,
      color: 'from-green-500 to-emerald-400',
    },
    {
      name: 'Monthly Revenue',
      value: `$${((stats?.revenue || 0) / 100).toLocaleString()}`,
      change: 'This month',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-400',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
            <div className="text-xs text-green-400 mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Processing Videos */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Video Processing</h2>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Processing</span>
              <span className="text-yellow-400 font-medium">
                {stats?.processingVideos || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Failed (24h)</span>
              <span className="text-red-400 font-medium">
                {stats?.failedVideos || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="text-green-400 font-medium">
                {stats?.totalVideos
                  ? Math.round(((stats.totalVideos - (stats.failedVideos || 0)) / stats.totalVideos) * 100)
                  : 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/users"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center"
            >
              <Users className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm">Manage Users</span>
            </a>
            <a
              href="/admin/videos"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center"
            >
              <Video className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm">View Videos</span>
            </a>
            <a
              href="/admin/moderation"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center"
            >
              <Activity className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm">Moderation Queue</span>
            </a>
            <a
              href="/admin/analytics"
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center"
            >
              <TrendingUp className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm">Analytics</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
