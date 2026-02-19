import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe, getPlanByPriceId, PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// This endpoint syncs the subscription status from Stripe
// Useful when webhook is not set up
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
    }

    // Get subscriptions from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: subscription.stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (stripeSubscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const stripeSub = stripeSubscriptions.data[0]
    const priceId = stripeSub.items.data[0]?.price.id
    const plan = getPlanByPriceId(priceId) || 'BASIC'
    const planConfig = PLANS[plan]

    // Update local subscription
    const updated = await prisma.subscription.update({
      where: { userId: session.user.id },
      data: {
        plan,
        status: 'ACTIVE',
        credits: planConfig.credits,
        monthlyCredits: planConfig.credits,
        stripeSubscriptionId: stripeSub.id,
        stripePriceId: priceId,
        currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    })

    return NextResponse.json({
      success: true,
      plan: updated.plan,
      credits: updated.credits,
      status: updated.status,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync subscription' },
      { status: 500 }
    )
  }
}
