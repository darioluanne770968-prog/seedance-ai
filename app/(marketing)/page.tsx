import { Hero } from '@/components/marketing/Hero'
import { Features } from '@/components/marketing/Features'
import { Pricing } from '@/components/marketing/Pricing'
import { CTA } from '@/components/marketing/CTA'

export default function HomePage() {
  return (
    <div className="relative">
      {/* 背景渐变 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-500/30 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-0 w-[800px] h-[800px] bg-blue-500/30 rounded-full blur-3xl opacity-20" />
      </div>

      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  )
}
