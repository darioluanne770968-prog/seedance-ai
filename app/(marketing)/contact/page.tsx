import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">联系我们</h1>
        <p className="text-xl text-muted-foreground mb-12">
          我们的团队随时准备帮助您了解 Seedance 如何助力您的业务
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 邮件联系 */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">电子邮件</h3>
            <p className="text-muted-foreground mb-4">
              发送邮件给我们的销售团队
            </p>
            <a
              href="mailto:sales@seedances.net"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              sales@seedances.net
            </a>
          </div>

          {/* 在线咨询 */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">在线支持</h3>
            <p className="text-muted-foreground mb-4">
              通过在线聊天获取即时帮助
            </p>
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              开始聊天
            </button>
          </div>
        </div>

        {/* 联系表单 */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">发送消息</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="张三"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="zhang@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                公司名称
              </label>
              <input
                type="text"
                id="company"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="您的公司"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                消息
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="告诉我们您的需求..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              发送消息
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
