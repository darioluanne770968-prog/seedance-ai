import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

// GET - List refund requests
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

    // In a real app, you'd have a RefundRequest model
    // For now, return recent failed videos that might need refunds
    const failedVideos = await prisma.video.findMany({
      where: {
        status: 'FAILED',
        creditsUsed: { gt: 0 },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ refundCandidates: failedVideos })
  } catch (error) {
    console.error('List refunds error:', error)
    return NextResponse.json(
      { error: 'Failed to list refunds' },
      { status: 500 }
    )
  }
}

// POST - Process a refund
export async function POST(req: NextRequest) {
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

    const { type, userId, videoId, amount, reason } = await req.json()

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Type and user ID are required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'credits': {
        // Credit refund - add credits back to user
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Invalid credit amount' },
            { status: 400 }
          )
        }

        await prisma.subscription.update({
          where: { userId },
          data: {
            credits: { increment: amount },
          },
        })

        // If video ID provided, mark as refunded
        if (videoId) {
          await prisma.video.update({
            where: { id: videoId },
            data: {
              errorMessage: `${await prisma.video.findUnique({ where: { id: videoId }, select: { errorMessage: true } }).then(v => v?.errorMessage || '')} [Refunded: ${amount} credits]`,
            },
          })
        }

        return NextResponse.json({
          success: true,
          type: 'credits',
          amount,
          message: `Refunded ${amount} credits to user`,
        })
      }

      case 'stripe': {
        // Stripe refund
        const subscription = await prisma.subscription.findUnique({
          where: { userId },
          select: { stripeCustomerId: true },
        })

        if (!subscription?.stripeCustomerId) {
          return NextResponse.json(
            { error: 'No Stripe customer found for user' },
            { status: 400 }
          )
        }

        // Get recent charges for this customer
        const charges = await stripe.charges.list({
          customer: subscription.stripeCustomerId,
          limit: 1,
        })

        if (charges.data.length === 0) {
          return NextResponse.json(
            { error: 'No charges found to refund' },
            { status: 400 }
          )
        }

        const charge = charges.data[0]

        // Create refund
        const refund = await stripe.refunds.create({
          charge: charge.id,
          amount: amount ? amount : undefined, // Partial or full refund
          reason: 'requested_by_customer',
          metadata: {
            userId,
            adminId: session.user.id,
            reason: reason || 'Admin initiated refund',
          },
        })

        return NextResponse.json({
          success: true,
          type: 'stripe',
          refundId: refund.id,
          amount: refund.amount,
          status: refund.status,
          message: 'Stripe refund processed',
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid refund type' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Process refund error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    )
  }
}
