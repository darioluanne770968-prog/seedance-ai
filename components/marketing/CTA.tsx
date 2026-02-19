import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20 -z-10" />

          {/* Content */}
          <div className="relative p-12 md:p-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10 rounded-3xl backdrop-blur-sm text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              准备好创造令人惊叹的视频了吗?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              加入数千名创作者,开始使用 AI 将你的想法转化为现实
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all group"
              >
                免费开始创作
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                联系销售团队
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
