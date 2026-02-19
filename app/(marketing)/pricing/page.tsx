'use client'

import { Suspense, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    description: 'Get started with AI video generation',
    price: { monthly: 0, yearly: 0 },
    credits: 100,
    icon: Sparkles,
    features: [
      '100 credits per month',
      'Basic video generation',
      '720p resolution',
      'Standard queue priority',
      'Community support',
    ],
  },
  {
    id: 'BASIC',
    name: 'Basic',
    description: 'For casual creators',
    price: { monthly: 9.99, yearly: 99.99 },
    credits: 500,
    icon: Zap,
    features: [
      '500 credits per month',
      'All video models',
      '1080p resolution',
      'Priority queue',
      'Email support',
      'Download history',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    description: 'For professional creators',
    price: { monthly: 29.99, yearly: 299.99 },
    credits: 2000,
    icon: Crown,
    popular: true,
    features: [
      '2,000 credits per month',
      'All models including Sora 2',
      '4K resolution',
      'High priority queue',
      'API access',
      'Priority support',
      'Commercial license',
    ],
  },
  {
    id: 'MAX',
    name: 'Max',
    description: 'For teams and enterprises',
    price: { monthly: 99.99, yearly: 999.99 },
    credits: 10000,
    icon: Crown,
    features: [
      '10,000 credits per month',
      'Everything in Pro',
      'Unlimited resolution',
      'Fastest queue priority',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration',
      'SLA guarantee',
    ],
  },
]

function PricingContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push('/login?redirect=/pricing')
      return
    }

    if (planId === 'FREE') {
      router.push('/create')
      return
    }

    setLoading(planId)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. Upgrade or downgrade anytime.
          </p>

          {canceled && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 max-w-md mx-auto">
              Checkout was canceled. Feel free to try again when you're ready.
            </div>
          )}
        </div>

        {/* Interval Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                interval === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                interval === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = plan.price[interval]
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  isPopular
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isPopular ? 'bg-blue-500' : 'bg-white/10'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      ${price.toFixed(2)}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground ml-2">
                        /{interval === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-yellow-400 mt-2">
                    {plan.credits.toLocaleString()} credits/month
                  </p>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                    isPopular
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : plan.id === 'FREE'
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-white/10 hover:bg-white/20'
                  } disabled:opacity-50`}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : plan.id === 'FREE' ? (
                    'Get Started'
                  ) : (
                    'Subscribe'
                  )}
                </button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold mb-2">What are credits?</h3>
              <p className="text-sm text-muted-foreground">
                Credits are used to generate videos. Different AI models consume different amounts of credits based on their complexity and output quality.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Do unused credits roll over?</h3>
              <p className="text-sm text-muted-foreground">
                Credits reset at the beginning of each billing period. Unused credits do not roll over to the next month.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) and various local payment methods through Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-10 border border-white/10">
          <h2 className="text-2xl font-bold mb-3">Need more?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Contact us for custom enterprise solutions with unlimited credits, dedicated support, and custom integrations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="py-16 px-4 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
