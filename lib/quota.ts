import { prisma } from './prisma'
import { Plan } from '@prisma/client'

interface QuotaLimits {
  dailyGenerations: number
  maxDurationPerVideo: number
  maxTotalDuration: number
  queuePriority: 'low' | 'normal' | 'high' | 'highest'
  maxResolution: string
  allowedModels: string[]
}

const QUOTA_LIMITS: Record<Plan, QuotaLimits> = {
  FREE: {
    dailyGenerations: 3,
    maxDurationPerVideo: 5,
    maxTotalDuration: 15,
    queuePriority: 'low',
    maxResolution: '720p',
    allowedModels: ['seedance-1.5-pro'], // Only basic models
  },
  BASIC: {
    dailyGenerations: 20,
    maxDurationPerVideo: 10,
    maxTotalDuration: 100,
    queuePriority: 'normal',
    maxResolution: '1080p',
    allowedModels: ['seedance-1.5-pro', 'seedance-2', 'wan-2.5', 'kling-ai', 'hailuo-ai'],
  },
  PRO: {
    dailyGenerations: Infinity,
    maxDurationPerVideo: 30,
    maxTotalDuration: Infinity,
    queuePriority: 'high',
    maxResolution: '4K',
    allowedModels: ['*'], // All models
  },
  MAX: {
    dailyGenerations: Infinity,
    maxDurationPerVideo: 120,
    maxTotalDuration: Infinity,
    queuePriority: 'highest',
    maxResolution: 'Unlimited',
    allowedModels: ['*'], // All models
  },
}

// Resolution order for comparison
const RESOLUTION_ORDER = ['480p', '720p', '1080p', '4K', 'Unlimited']

export interface QuotaCheckResult {
  allowed: boolean
  remaining: number
  plan: Plan
  priority?: 'low' | 'normal' | 'high' | 'highest'
  message?: string
  upgradeRequired?: boolean
}

/**
 * Check if user has quota to generate a video
 */
export async function checkQuota(
  userId: string,
  requestedDuration: number = 5,
  requestedModel: string = 'seedance-1.5-pro',
  requestedResolution: string = '720p'
): Promise<QuotaCheckResult> {
  // Get user subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const plan = subscription?.plan || 'FREE'
  const status = subscription?.status || 'ACTIVE'
  const limits = QUOTA_LIMITS[plan]

  // Check subscription status
  if (plan !== 'FREE' && status !== 'ACTIVE') {
    return {
      allowed: false,
      remaining: 0,
      message: 'Your subscription is not active',
      plan,
      upgradeRequired: true,
    }
  }

  // Check model access
  if (limits.allowedModels[0] !== '*' && !limits.allowedModels.includes(requestedModel)) {
    return {
      allowed: false,
      remaining: 0,
      message: `${requestedModel} is not available on your plan. Upgrade to access all models.`,
      plan,
      upgradeRequired: true,
    }
  }

  // Check resolution limits
  const maxResIdx = RESOLUTION_ORDER.indexOf(limits.maxResolution)
  const requestedResIdx = RESOLUTION_ORDER.indexOf(requestedResolution)
  if (requestedResIdx > maxResIdx && maxResIdx !== -1) {
    return {
      allowed: false,
      remaining: 0,
      message: `Your plan only supports up to ${limits.maxResolution} resolution`,
      plan,
      upgradeRequired: true,
    }
  }

  // Check duration limits
  if (requestedDuration > limits.maxDurationPerVideo) {
    return {
      allowed: false,
      remaining: 0,
      message: `Maximum duration is ${limits.maxDurationPerVideo} seconds on your plan`,
      plan,
      upgradeRequired: true,
    }
  }

  // Unlimited for high-tier plans
  if (limits.dailyGenerations === Infinity) {
    return {
      allowed: true,
      remaining: Infinity,
      plan,
      priority: limits.queuePriority,
    }
  }

  // Check daily quota for limited plans
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })

  const usedCount = usage?.count || 0
  const usedDuration = usage?.duration || 0
  const remaining = Math.max(0, limits.dailyGenerations - usedCount)

  // Check generation count limit
  if (remaining === 0) {
    return {
      allowed: false,
      message: 'Daily quota exceeded. Upgrade for more generations.',
      plan,
      remaining: 0,
      upgradeRequired: true,
    }
  }

  // Check total duration limit
  if (usedDuration + requestedDuration > limits.maxTotalDuration) {
    return {
      allowed: false,
      message: 'Daily duration limit exceeded',
      plan,
      remaining,
      upgradeRequired: true,
    }
  }

  // All checks passed
  return {
    allowed: true,
    remaining,
    plan,
    priority: limits.queuePriority,
  }
}

/**
 * Increment daily usage after successful video generation
 */
export async function incrementDailyUsage(
  userId: string,
  duration: number
): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.dailyUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      count: 1,
      duration,
    },
    update: {
      count: { increment: 1 },
      duration: { increment: duration },
    },
  })
}

/**
 * Get user's current quota status
 */
export async function getUserQuota(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const plan = subscription?.plan || 'FREE'
  const limits = QUOTA_LIMITS[plan]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const usage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })

  const used = usage?.count || 0
  const usedDuration = usage?.duration || 0

  return {
    plan,
    limits,
    used,
    usedDuration,
    remaining: limits.dailyGenerations === Infinity
      ? Infinity
      : Math.max(0, limits.dailyGenerations - used),
  }
}

/**
 * Get queue priority for a user's plan
 */
export function getQueuePriority(plan: Plan): 'low' | 'normal' | 'high' | 'highest' {
  return QUOTA_LIMITS[plan].queuePriority
}

/**
 * Check if a model is available for a plan
 */
export function isModelAvailable(plan: Plan, model: string): boolean {
  const allowed = QUOTA_LIMITS[plan].allowedModels
  return allowed[0] === '*' || allowed.includes(model)
}
