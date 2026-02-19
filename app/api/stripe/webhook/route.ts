import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, getPlanByPriceId, PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoiceFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  const subscriptionId = session.subscription as string
  const customerId = session.customer as string

  // Get subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = stripeSubscription.items.data[0]?.price.id
  const plan = getPlanByPriceId(priceId) || 'BASIC'
  const planConfig = PLANS[plan]

  // Extract period data with type safety
  const subData = stripeSubscription as unknown as { current_period_start: number; current_period_end: number }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status: 'ACTIVE',
      credits: planConfig.credits,
      monthlyCredits: planConfig.credits,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subData.current_period_start * 1000),
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
    },
    update: {
      plan,
      status: 'ACTIVE',
      credits: planConfig.credits,
      monthlyCredits: planConfig.credits,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subData.current_period_start * 1000),
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
  })

  console.log(`Subscription activated for user ${userId}: ${plan}`)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    // Try to find by subscription ID
    const existingSub = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })
    if (!existingSub) {
      console.error('No userId found for subscription')
      return
    }
  }

  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanByPriceId(priceId) || 'BASIC'
  const planConfig = PLANS[plan]

  const status = mapStripeStatus(subscription.status)

  // Extract period data with type safety
  const subData = subscription as unknown as { current_period_start: number; current_period_end: number }

  await prisma.subscription.updateMany({
    where: {
      OR: [
        { userId: userId || '' },
        { stripeSubscriptionId: subscription.id },
      ],
    },
    data: {
      plan,
      status,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subData.current_period_start * 1000),
      currentPeriodEnd: new Date(subData.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  })

  // If subscription is renewed, reset credits
  if (status === 'ACTIVE' && !subscription.cancel_at_period_end) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        credits: planConfig.credits,
        creditsResetAt: new Date(),
      },
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: 'FREE',
      status: 'CANCELED',
      credits: 100, // Reset to free tier
      monthlyCredits: 100,
      canceledAt: new Date(),
    },
  })
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription
  if (!subscription) return null

  return typeof subscription === 'string' ? subscription : subscription.id
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice)
  if (!subscriptionId) return

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  })

  if (subscription) {
    const planConfig = PLANS[subscription.plan]
    // Reset credits on successful payment (monthly renewal)
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        credits: planConfig.credits,
        creditsResetAt: new Date(),
        status: 'ACTIVE',
      },
    })
    console.log(`Credits reset for subscription ${subscriptionId}`)
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice)
  if (!subscriptionId) return

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'PAST_DUE',
    },
  })
}

function mapStripeStatus(status: Stripe.Subscription.Status): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'PAUSED' | 'TRIALING' {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'canceled':
      return 'CANCELED'
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE'
    case 'paused':
      return 'PAUSED'
    case 'trialing':
      return 'TRIALING'
    default:
      return 'ACTIVE'
  }
}
