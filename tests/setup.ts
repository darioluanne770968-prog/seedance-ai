import { vi } from 'vitest'

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3456'
process.env.NEXT_PUBLIC_APP_NAME = 'Seedance Test'

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    video: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    dailyUsage: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
  stripe: {
    subscriptions: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
    customers: {
      create: vi.fn(),
    },
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  PLANS: {
    FREE: { credits: 100, price: 0 },
    BASIC: { credits: 500, price: 999 },
    PRO: { credits: 2000, price: 2999 },
    MAX: { credits: 10000, price: 9999 },
  },
}))
