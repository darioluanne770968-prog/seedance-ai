import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/stripe'

// Vercel Cron Job - Reset monthly credits
// Runs on the 1st of each month at midnight UTC
export async function GET(req: NextRequest) {
  // Verify cron secret for security
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    let resetCount = 0

    for (const sub of subscriptions) {
      const planConfig = PLANS[sub.plan as keyof typeof PLANS]
      if (planConfig) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            credits: planConfig.credits,
            creditsResetAt: new Date(),
          },
        })
        resetCount++
      }
    }

    console.log(`Reset credits for ${resetCount} subscriptions`)

    return NextResponse.json({
      success: true,
      resetCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Credit reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset credits' },
      { status: 500 }
    )
  }
}
