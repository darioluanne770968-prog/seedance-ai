# Seedance AI Clone - AI 视频生成平台

> 一个完整的 AI 视频生成 SaaS 平台,支持文本转视频和图像转视频

## 🎬 项目简介

Seedance Clone 是一个高质量的 AI 视频生成平台,提供:

- 📝 **文本转视频**: 从文字描述生成精美视频
- 🖼️ **图像转视频**: 让静态图片动起来
- 🎨 **多种风格**: 电影级、动漫、写实等艺术风格
- ⚡ **快速生成**: 强大的 AI 引擎确保快速处理
- 💎 **灵活定价**: FREE/PRO/ENTERPRISE 三种方案

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **UI 组件**: Radix UI + shadcn/ui
- **图标**: Lucide React
- **状态管理**: Zustand
- **数据获取**: TanStack Query

### 后端
- **框架**: Next.js API Routes
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js v5
- **文件存储**: Cloudflare R2
- **AI 服务**: Replicate / Runway / Pika

## 🚀 快速开始

### 1. 克隆项目

\`\`\`bash
cd seedance-clone
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 3. 配置环境变量

复制 \`.env.example\` 到 \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

编辑 \`.env.local\` 并填写必要的配置:

\`\`\`env
# 数据库
DATABASE_URL="postgresql://user:pass@localhost:5432/seedance"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"

# OAuth (可选)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI 服务
AI_VIDEO_PROVIDER="replicate"
REPLICATE_API_TOKEN="your-replicate-token"

# R2 存储
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="seedance-videos"
\`\`\`

### 4. 初始化数据库

\`\`\`bash
npx prisma db push
\`\`\`

### 5. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

\`\`\`
seedance-clone/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # 营销页面
│   ├── (auth)/            # 认证页面
│   ├── (app)/             # 应用页面
│   ├── api/               # API 路由
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── marketing/         # 营销组件
│   ├── layout/            # 布局组件
│   └── ui/               # UI 组件
├── lib/                   # 核心库
│   ├── prisma.ts         # Prisma 客户端
│   └── utils.ts          # 工具函数
├── prisma/               # Prisma 配置
│   └── schema.prisma     # 数据库模型
├── public/               # 静态资源
└── README.md             # 项目文档
\`\`\`

## 🎨 功能特性

### ✅ 已完成
- [x] 精美的营销落地页
- [x] 响应式设计
- [x] 深色主题
- [x] 渐变背景和动画
- [x] 完整的数据库设计
- [x] 项目基础架构

### 🚧 进行中
- [ ] 用户认证系统
- [ ] 视频生成功能
- [ ] 文件上传
- [ ] 支付集成
- [ ] 配额系统

### 📋 待开发
- [ ] 用户仪表板
- [ ] 视频管理
- [ ] 账户设置
- [ ] 管理后台

## 💡 开发计划

### 第一周 (Day 1-7)
- ✅ Day 1-2: 项目搭建与数据库
- 🔄 Day 3-4: 认证系统
- 📅 Day 5-7: 营销页面完善

### 第二周 (Day 8-14)
- 📅 Day 8-9: 文件存储与上传
- 📅 Day 10-11: AI 视频生成
- 📅 Day 12: 支付集成
- 📅 Day 13: 配额系统与仪表板
- 📅 Day 14: 测试与部署

## 📝 可用脚本

- \`npm run dev\` - 启动开发服务器
- \`npm run build\` - 构建生产版本
- \`npm run start\` - 启动生产服务器
- \`npm run lint\` - 运行 ESLint
- \`npx prisma studio\` - 打开 Prisma Studio
- \`npx prisma db push\` - 推送数据库模式

## 🔧 配置说明

### 数据库

推荐使用以下数据库服务:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - 开源 Firebase 替代品
- [Railway](https://railway.app) - 简单的部署平台

### 文件存储

使用 Cloudflare R2 进行文件存储:
1. 在 Cloudflare 创建 R2 存储桶
2. 获取 API 凭证
3. 配置环境变量

### AI 服务

支持多个 AI 视频生成提供商:
- **Replicate**: 开发者友好,按需付费
- **Runway**: 高质量输出
- **Pika**: 快速生成

## 🚀 部署

### Vercel 部署 (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

\`\`\`bash
vercel --prod
\`\`\`

### 域名配置

在 Vercel 中添加自定义域名 \`seedances.net\`

## 📄 许可证

MIT License

## 🤝 贡献

欢迎贡献!请先阅读 [贡献指南](CONTRIBUTING.md)。

## 📞 联系方式

- 网站: [https://seedances.net](https://seedances.net)
- 邮箱: hello@seedances.net

---

**Made with ❤️ and AI**
