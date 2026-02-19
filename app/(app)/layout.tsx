import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppLayoutClient } from '@/components/layout/AppLayoutClient'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return <AppLayoutClient>{children}</AppLayoutClient>
}
