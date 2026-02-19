import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Video, Clock, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  // Get user stats
  const [videoCount, subscription, todayUsage] = await Promise.all([
    prisma.video.count({
      where: { userId: session!.user.id },
    }),
    prisma.subscription.findUnique({
      where: { userId: session!.user.id },
    }),
    prisma.dailyUsage.findFirst({
      where: {
        userId: session!.user.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  const processingCount = await prisma.video.count({
    where: {
      userId: session!.user.id,
      status: { in: ['PENDING', 'QUEUED', 'PROCESSING'] },
    },
  })

  const plan = subscription?.plan || 'FREE'
  const usedToday = todayUsage?.count || 0
  const maxDaily = plan === 'FREE' ? 3 : Infinity

  const stats = [
    {
      name: 'Total Videos',
      value: videoCount.toString(),
      icon: Video,
      color: 'text-purple-500',
    },
    {
      name: 'Processing',
      value: processingCount.toString(),
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      name: 'Today\'s Usage',
      value: plan === 'FREE' ? `${usedToday}/${maxDaily}` : usedToday.toString(),
      icon: TrendingUp,
      color: 'text-pink-500',
    },
    {
      name: 'Plan',
      value: plan,
      icon: Zap,
      color: 'text-green-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your AI video creations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/create/text-to-video"
            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
              📝 Text to Video
            </h3>
            <p className="text-sm text-muted-foreground">
              Generate videos from text descriptions
            </p>
          </Link>

          <Link
            href="/create/image-to-video"
            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-400 transition-colors">
              🖼️ Image to Video
            </h3>
            <p className="text-sm text-muted-foreground">
              Bring your images to life with AI
            </p>
          </Link>
        </div>
      </div>

      {/* Upgrade Banner (if FREE plan) */}
      {plan === 'FREE' && (
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">
            Upgrade to Pro for unlimited videos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get unlimited generations, longer videos, and priority processing
          </p>
          <Link
            href="/#pricing"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  )
}
