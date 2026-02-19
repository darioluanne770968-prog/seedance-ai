import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'FREE',
    price: '$0',
    description: '开始探索 AI 视频生成',
    features: [
      '每日 3 次生成',
      '每次最长 5 秒',
      '720p 分辨率',
      '基础风格选择',
      '社区支持',
    ],
    cta: '免费开始',
    href: '/register',
    popular: false,
  },
  {
    name: 'PRO',
    price: '$9.99',
    period: '/月',
    description: '解锁更多创作可能',
    features: [
      '无限生成次数',
      '每次最长 30 秒',
      '1080p 分辨率',
      '所有风格选择',
      '优先处理队列',
      '邮件支持',
      '商业使用许可',
    ],
    cta: '开始专业版',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'ENTERPRISE',
    price: 'Contact Us',
    description: '为团队和企业打造',
    features: [
      'Pro 的所有功能',
      '每次最长 120 秒',
      '4K 分辨率',
      '最高优先级',
      '专属客服',
      'API 访问',
      '自定义模型训练',
      '团队协作功能',
    ],
    cta: '联系销售',
    href: '/contact',
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            选择适合你的 <span className="gradient-text">定价方案</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            从免费开始,随时升级到专业版解锁更多功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 bg-background border rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-105'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium text-white">
                  最受欢迎
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block w-full py-3 px-4 text-center font-medium rounded-lg transition-all mb-8 ${
                  plan.popular
                    ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : 'text-foreground bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
