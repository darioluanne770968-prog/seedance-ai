import { prisma } from './prisma'
import { Plan } from '@prisma/client'

// Credits cost per model
export const MODEL_CREDITS: Record<string, number> = {
  'seedance-2.0': 150,
  'seedance-1.5-pro': 120,
  'sora-2': 200,
  'veo-3': 180,
  'wan-2.5': 100,
  'kling-ai': 80,
  'hailuo-ai': 60,
}

// Monthly credits per plan
export const PLAN_CREDITS: Record<Plan, number> = {
  FREE: 100,
  BASIC: 500,
  PRO: 2000,
  MAX: 10000,
}

export interface CreditsCheckResult {
  allowed: boolean
  currentCredits: number
  requiredCredits: number
  plan: Plan
  message?: string
  upgradeRequired?: boolean
}

export async function getCreditsForModel(modelId: string): Promise<number> {
  return MODEL_CREDITS[modelId] || 100
}

export async function checkCredits(
  userId: string,
  modelId: string
): Promise<CreditsCheckResult> {
  // Get or create user subscription
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  // Create default subscription if not exists
  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: 'FREE',
        status: 'ACTIVE',
        credits: PLAN_CREDITS.FREE,
        monthlyCredits: PLAN_CREDITS.FREE,
      },
    })
  }

  const plan = subscription.plan
  const currentCredits = subscription.credits
  const requiredCredits = MODEL_CREDITS[modelId] || 100

  // Check if subscription is active (for paid plans)
  if (plan !== 'FREE' && subscription.status !== 'ACTIVE') {
    return {
      allowed: false,
      currentCredits,
      requiredCredits,
      plan,
      message: 'Your subscription is not active',
      upgradeRequired: true,
    }
  }

  // Check if user has enough credits
  if (currentCredits < requiredCredits) {
    return {
      allowed: false,
      currentCredits,
      requiredCredits,
      plan,
      message: `Not enough credits. You need ${requiredCredits} credits but only have ${currentCredits}.`,
      upgradeRequired: true,
    }
  }

  return {
    allowed: true,
    currentCredits,
    requiredCredits,
    plan,
  }
}

export async function deductCredits(
  userId: string,
  modelId: string,
  videoId: string
): Promise<{ success: boolean; remainingCredits: number }> {
  const creditsToDeduct = MODEL_CREDITS[modelId] || 100

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.findUnique({
      where: { userId },
    })

    if (!subscription || subscription.credits < creditsToDeduct) {
      throw new Error('Insufficient credits')
    }

    // Deduct credits
    const updated = await tx.subscription.update({
      where: { userId },
      data: {
        credits: { decrement: creditsToDeduct },
      },
    })

    // Update video with credits used
    await tx.video.update({
      where: { id: videoId },
      data: {
        creditsUsed: creditsToDeduct,
      },
    })

    return updated.credits
  })

  return {
    success: true,
    remainingCredits: result,
  }
}

export async function refundCredits(
  userId: string,
  credits: number
): Promise<void> {
  await prisma.subscription.update({
    where: { userId },
    data: {
      credits: { increment: credits },
    },
  })
}

export async function getUserCredits(userId: string) {
  let subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: 'FREE',
        status: 'ACTIVE',
        credits: PLAN_CREDITS.FREE,
        monthlyCredits: PLAN_CREDITS.FREE,
      },
    })
  }

  return {
    plan: subscription.plan,
    credits: subscription.credits,
    monthlyCredits: subscription.monthlyCredits,
    status: subscription.status,
  }
}

export async function resetMonthlyCredits(userId: string): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (subscription) {
    const monthlyCredits = PLAN_CREDITS[subscription.plan]
    await prisma.subscription.update({
      where: { userId },
      data: {
        credits: monthlyCredits,
        creditsResetAt: new Date(),
      },
    })
  }
}
