import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

// Plan configuration
export const PLANS = {
  FREE: {
    name: 'Free',
    credits: 100,
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      '100 credits per month',
      'Basic video generation',
      '720p resolution',
      'Standard queue priority',
    ],
  },
  BASIC: {
    name: 'Basic',
    credits: 500,
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
      yearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
    },
    features: [
      '500 credits per month',
      'All video models',
      '1080p resolution',
      'Priority queue',
      'Email support',
    ],
  },
  PRO: {
    name: 'Pro',
    credits: 2000,
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
    popular: true,
    features: [
      '2,000 credits per month',
      'All video models including Sora 2',
      '4K resolution',
      'High priority queue',
      'API access',
      'Priority support',
    ],
  },
  MAX: {
    name: 'Max',
    credits: 10000,
    price: {
      monthly: 99.99,
      yearly: 999.99,
    },
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_MAX_MONTHLY,
      yearly: process.env.STRIPE_PRICE_MAX_YEARLY,
    },
    features: [
      '10,000 credits per month',
      'All features included',
      'Unlimited resolution',
      'Fastest queue priority',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if ('stripePriceId' in plan) {
      if (plan.stripePriceId.monthly === priceId || plan.stripePriceId.yearly === priceId) {
        return key as PlanKey
      }
    }
  }
  return null
}

export function isYearlyPrice(priceId: string): boolean {
  for (const plan of Object.values(PLANS)) {
    if ('stripePriceId' in plan && plan.stripePriceId.yearly === priceId) {
      return true
    }
  }
  return false
}
