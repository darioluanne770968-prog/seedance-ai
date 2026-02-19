import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLAN_CREDITS } from '@/lib/credits'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    // Create default subscription if not exists
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: 'FREE',
          status: 'ACTIVE',
          credits: PLAN_CREDITS.FREE,
          monthlyCredits: PLAN_CREDITS.FREE,
        },
      })
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      credits: subscription.credits,
      monthlyCredits: subscription.monthlyCredits,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}
