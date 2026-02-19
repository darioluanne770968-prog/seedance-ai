'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  Coins,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react'

interface SubscriptionData {
  plan: string
  status: string
  credits: number
  monthlyCredits: number
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/user/subscription')
      if (res.ok) {
        const data = await res.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncSubscription = async () => {
    setSyncLoading(true)
    try {
      const res = await fetch('/api/stripe/sync', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        // Refresh subscription data
        await fetchSubscription()
        alert(`Subscription synced! Plan: ${data.plan}, Credits: ${data.credits}`)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error('Failed to sync:', error)
      alert(error.message || 'Failed to sync subscription')
    } finally {
      setSyncLoading(false)
    }
  }

  const openPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to open portal:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const plan = subscription?.plan || 'FREE'
  const isPaid = plan !== 'FREE'
  const creditsUsed = (subscription?.monthlyCredits || 100) - (subscription?.credits || 100)
  const creditsPercentage = Math.round((creditsUsed / (subscription?.monthlyCredits || 100)) * 100)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground">Your active subscription</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              plan === 'FREE' ? 'bg-gray-500/20 text-gray-400' :
              plan === 'BASIC' ? 'bg-blue-500/20 text-blue-400' :
              plan === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {plan}
            </span>
            {subscription?.status === 'ACTIVE' && (
              <span className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Credits */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-muted-foreground mb-2">
              <Coins className="w-4 h-4 mr-2" />
              <span className="text-sm">Credits Remaining</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {subscription?.credits?.toLocaleString() || 100}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Used this month</span>
                <span>{creditsUsed} / {subscription?.monthlyCredits || 100}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                  style={{ width: `${creditsPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Monthly Credits */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm">Monthly Allowance</span>
            </div>
            <div className="text-2xl font-bold">
              {subscription?.monthlyCredits?.toLocaleString() || 100}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Credits per billing cycle
            </p>
          </div>

          {/* Next Billing */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {subscription?.cancelAtPeriodEnd ? 'Expires On' : 'Next Billing'}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : 'N/A'
              }
            </div>
            {subscription?.cancelAtPeriodEnd && (
              <p className="text-xs text-yellow-400 mt-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Subscription will not renew
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
          {isPaid ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Manage Subscription
              <ExternalLink className="w-3 h-3 ml-2" />
            </button>
          ) : (
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Link>
          )}

          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
          >
            View All Plans
          </Link>

          <button
            onClick={syncSubscription}
            disabled={syncLoading}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            {syncLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync from Stripe
          </button>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Plan Features</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4">Basic</th>
                <th className="text-center py-3 px-4">Pro</th>
                <th className="text-center py-3 px-4">Max</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">Monthly Credits</td>
                <td className="text-center py-3 px-4">100</td>
                <td className="text-center py-3 px-4">500</td>
                <td className="text-center py-3 px-4">2,000</td>
                <td className="text-center py-3 px-4">10,000</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">Max Resolution</td>
                <td className="text-center py-3 px-4">720p</td>
                <td className="text-center py-3 px-4">1080p</td>
                <td className="text-center py-3 px-4">4K</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">Queue Priority</td>
                <td className="text-center py-3 px-4">Standard</td>
                <td className="text-center py-3 px-4">Priority</td>
                <td className="text-center py-3 px-4">High</td>
                <td className="text-center py-3 px-4">Fastest</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">All AI Models</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">API Access</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
