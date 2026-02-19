import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get today's date at midnight
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Fetch all stats in parallel
    const [
      totalUsers,
      newUsersToday,
      totalVideos,
      videosToday,
      activeSubscriptions,
      processingVideos,
      failedVideos,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.video.count({
        where: { deletedAt: null },
      }),
      prisma.video.count({
        where: {
          createdAt: { gte: today },
          deletedAt: null,
        },
      }),
      prisma.subscription.count({
        where: {
          plan: { not: 'FREE' },
          status: 'ACTIVE',
        },
      }),
      prisma.video.count({
        where: {
          status: 'PROCESSING',
          deletedAt: null,
        },
      }),
      prisma.video.count({
        where: {
          status: 'FAILED',
          createdAt: { gte: yesterday },
          deletedAt: null,
        },
      }),
    ])

    // Calculate rough revenue (based on active subscriptions)
    const subscriptions = await prisma.subscription.groupBy({
      by: ['plan'],
      where: {
        plan: { not: 'FREE' },
        status: 'ACTIVE',
      },
      _count: true,
    })

    const prices: Record<string, number> = {
      BASIC: 999, // $9.99
      PRO: 2999,  // $29.99
      MAX: 9999,  // $99.99
    }

    const revenue = subscriptions.reduce((total, sub) => {
      return total + (prices[sub.plan] || 0) * sub._count
    }, 0)

    return NextResponse.json({
      totalUsers,
      newUsersToday,
      totalVideos,
      videosToday,
      activeSubscriptions,
      processingVideos,
      failedVideos,
      revenue,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
