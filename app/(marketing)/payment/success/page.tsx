'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react'

function PaymentSuccessFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Processing your payment...</p>
      </div>
    </div>
  )
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking session
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading) {
    return <PaymentSuccessFallback />
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for subscribing. Your credits have been added to your account.
        </p>

        {/* Features */}
        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            What's included
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Credits added to your account
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Access to all AI models
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Priority queue processing
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              High resolution exports
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-500 transition-all"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/account/billing"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-all"
          >
            View Subscription
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
