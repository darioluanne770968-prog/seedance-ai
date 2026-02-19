'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Credits {
  plan: string
  credits: number
  monthlyCredits: number
  status: string
}

export function useCredits() {
  const { data: session } = useSession()
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = async () => {
    if (!session) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/user/credits')
      if (res.ok) {
        const data = await res.json()
        setCredits(data)
      } else {
        setError('Failed to fetch credits')
      }
    } catch (err) {
      setError('Failed to fetch credits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [session])

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits,
  }
}
