import Link from 'next/link'
import { Sparkles, Github, Twitter, Mail } from 'lucide-react'

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { name: '功能', href: '/#features' },
      { name: '定价', href: '/#pricing' },
      { name: '文档', href: '/docs' },
      { name: '更新日志', href: '/changelog' },
    ],
  },
  company: {
    title: '公司',
    links: [
      { name: '关于', href: '/about' },
      { name: '博客', href: '/blog' },
      { name: '联系我们', href: '/contact' },
    ],
  },
  legal: {
    title: '法律',
    links: [
      { name: '隐私政策', href: '/privacy' },
      { name: '服务条款', href: '/terms' },
      { name: '退款政策', href: '/refund' },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Logo and description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Seedance
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              AI 驱动的视频生成平台,将你的创意转化为令人惊叹的视觉内容。
            </p>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@seedances.net"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          {Object.values(footerLinks).map((group, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Seedance Clone. All rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ by AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
