import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <span className="text-xs font-medium text-purple-400">NEW</span>
            <span className="text-xs text-muted-foreground">
              Seedance 1.5 Pro 现已上线
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              将文字和图像
            </span>
            <br />
            转化为电影级视频
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            一个支持从文本和图像生成多镜头视频的 AI 模型。
            创造流畅运动、丰富细节和电影美学的 1080p 视频。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all group"
            >
              免费开始
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
            >
              <Play className="mr-2 w-4 h-4" />
              观看演示
            </Link>
          </div>

          {/* Demo Video Placeholder */}
          <div id="demo" className="relative mx-auto max-w-5xl">
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-muted-foreground">
                    示例视频即将推出
                  </p>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
