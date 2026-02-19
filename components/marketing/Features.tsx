import { FileText, Image, Palette, Zap, Video, Sparkles } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: '文本转视频',
    description: '只需输入文字描述,AI 即可生成精美的视频内容。支持复杂场景和多镜头叙事。',
  },
  {
    icon: Image,
    title: '图像转视频',
    description: '上传静态图片,让 AI 赋予它生命。创建令人惊叹的动态视觉效果。',
  },
  {
    icon: Palette,
    title: '多种风格',
    description: '电影级、动漫、写实等多种艺术风格可选。打造独特的视觉美学。',
  },
  {
    icon: Zap,
    title: '快速生成',
    description: '强大的 AI 引擎确保快速处理。通常 30 秒内完成 5 秒视频生成。',
  },
  {
    icon: Video,
    title: '高清质量',
    description: '支持 720p, 1080p, 甚至 4K 分辨率。流畅的 24fps 或 30fps 帧率。',
  },
  {
    icon: Sparkles,
    title: '智能理解',
    description: '先进的语义理解和提示词跟随能力。精准实现你的创意愿景。',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            强大的 <span className="gradient-text">AI 视频生成</span> 能力
          </h2>
          <p className="text-lg text-muted-foreground">
            从简单的文字描述到复杂的视觉创作,一切尽在掌握
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-xl transition-all duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
