import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vercel Cron Job - Cleanup expired data
// Runs daily at 3 AM UTC
export async function GET(req: NextRequest) {
  // Verify cron secret for security
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Clean up expired reset tokens
    const expiredResetTokens = await prisma.user.updateMany({
      where: {
        resetTokenExpiry: { lt: now },
        resetToken: { not: null },
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    // Clean up expired verification tokens
    const expiredVerifyTokens = await prisma.user.updateMany({
      where: {
        verifyTokenExpiry: { lt: now },
        verifyToken: { not: null },
        emailVerified: null,
      },
      data: {
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    })

    // Clean up old failed/canceled videos (soft deleted > 30 days)
    const deletedVideos = await prisma.video.deleteMany({
      where: {
        deletedAt: { lt: thirtyDaysAgo },
      },
    })

    // Clean up stuck processing jobs (> 1 hour in PROCESSING status)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const stuckVideos = await prisma.video.updateMany({
      where: {
        status: 'PROCESSING',
        updatedAt: { lt: oneHourAgo },
      },
      data: {
        status: 'FAILED',
        error: 'Processing timeout - job exceeded maximum duration',
      },
    })

    // Clean up old daily usage records (> 90 days)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const oldUsageRecords = await prisma.dailyUsage.deleteMany({
      where: {
        date: { lt: ninetyDaysAgo },
      },
    })

    const summary = {
      expiredResetTokens: expiredResetTokens.count,
      expiredVerifyTokens: expiredVerifyTokens.count,
      deletedVideos: deletedVideos.count,
      stuckVideos: stuckVideos.count,
      oldUsageRecords: oldUsageRecords.count,
      timestamp: now.toISOString(),
    }

    console.log('Cleanup completed:', summary)

    return NextResponse.json({
      success: true,
      ...summary,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to run cleanup' },
      { status: 500 }
    )
  }
}
