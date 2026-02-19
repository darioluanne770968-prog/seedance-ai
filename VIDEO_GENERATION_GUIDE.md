# 视频生成功能使用指南

## 🎬 功能概览

Seedance Clone 现已支持完整的 AI 视频生成功能：
- **文本转视频** (Text-to-Video)
- **图像转视频** (Image-to-Video)

## 📋 前置要求

### 1. 配置 Replicate API

要使用视频生成功能，需要配置 Replicate API Token：

1. 访问 [Replicate](https://replicate.com) 并创建账户
2. 获取 API Token
3. 在 `.env.local` 中配置：

```env
REPLICATE_API_TOKEN=r8_your_token_here
```

### 2. 配置 Webhook（可选）

为了接收 AI 生成完成的回调，需要配置公网可访问的 webhook URL：

1. 使用 ngrok 或类似工具暴露本地服务器：
   ```bash
   ngrok http 3000
   ```

2. 更新 `.env.local` 中的 APP_URL：
   ```env
   NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
   ```

3. Webhook 端点：`/api/webhooks/replicate`

## 🚀 使用流程

### 文本转视频

1. 登录后访问 `/create` 或 `/create/text-to-video`
2. 填写表单：
   - **标题**：视频名称（可选）
   - **提示词**：详细描述你想要的视频内容（必填）
   - **风格**：选择艺术风格（Cinematic、Anime、Realistic 等）
   - **时长**：3-15 秒（FREE 用户最多 5 秒）
   - **分辨率**：720p、1080p 或 4K
3. 点击 "Generate Video"
4. 等待生成完成（通常 30-60 秒）

### 图像转视频

1. 访问 `/create/image-to-video`
2. 上传图片（支持 PNG、JPG、WebP、GIF，最大 10MB）
3. 填写表单：
   - **标题**：视频名称（可选）
   - **运动提示**：描述想要的动画效果（可选）
   - **时长**：3-10 秒
   - **分辨率**：720p 或 1080p
4. 点击 "Generate Video"
5. 等待生成完成

## 📊 配额限制

### FREE 计划
- 每日生成次数：3 次
- 单个视频最长：5 秒
- 每日总时长：15 秒
- 最高分辨率：720p
- 队列优先级：Low

### PRO 计划
- 无限生成次数
- 单个视频最长：30 秒
- 无总时长限制
- 最高分辨率：1080p
- 队列优先级：Normal

### ENTERPRISE 计划
- 无限生成次数
- 单个视频最长：120 秒
- 无总时长限制
- 最高分辨率：4K
- 队列优先级：High

## 🎨 AI 模型

系统支持多个 AI 视频生成模型：

### 文本转视频模型
- **Minimax Video-01**：高质量视频生成
- **Luma Photon**：快速高效
- **Kling AI**：专业级视频生成

### 图像转视频模型
- **Stable Video Diffusion**：平滑动画
- **Luma Ray**：高级图像动画

当前默认使用 Animate-Diff 模型（Replicate）。

## 📁 视频管理

### 查看视频列表
访问 `/videos` 查看所有生成的视频。卡片显示：
- 视频缩略图
- 标题和提示词
- 生成状态和进度
- 创建时间

### 视频状态
- **PENDING**：等待处理
- **QUEUED**：排队中
- **PROCESSING**：AI 生成中（显示进度百分比）
- **COMPLETED**：生成完成
- **FAILED**：生成失败

### 视频详情
点击视频卡片查看详情页 (`/videos/[id]`)：
- 视频播放器
- 下载按钮
- 分享功能
- 详细信息（提示词、参数、文件大小等）

## 🔧 技术实现

### API 端点

#### 1. 生成视频
```bash
POST /api/videos/generate
```

请求体（文本转视频）：
```json
{
  "generationType": "TEXT_TO_VIDEO",
  "prompt": "A cinematic shot of a futuristic city",
  "title": "My Video",
  "style": "cinematic",
  "duration": 5,
  "resolution": "1080p",
  "seed": 12345
}
```

请求体（图像转视频）：
```json
{
  "generationType": "IMAGE_TO_VIDEO",
  "prompt": "Camera slowly zooms in",
  "sourceImageUrl": "http://localhost:3000/uploads/abc.jpg",
  "duration": 5,
  "resolution": "1080p"
}
```

#### 2. 上传图片
```bash
POST /api/upload
Content-Type: multipart/form-data

file: [图片文件]
```

#### 3. Webhook 回调
```bash
POST /api/webhooks/replicate
```

Replicate 会在视频生成完成时调用此端点，自动更新视频状态。

### 文件上传

当前使用本地存储（`public/uploads/`）。

**生产环境建议切换到 Cloudflare R2：**

1. 配置 R2 凭证：
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=seedance-videos
   R2_PUBLIC_URL=https://your-bucket-url
   ```

2. 在 `lib/upload.ts` 中取消注释 R2 上传代码

## 🐛 调试

### 检查生成状态
```bash
# 查看数据库中的视频记录
npx prisma studio

# 查看 API 日志
# 开发服务器会输出详细的错误信息
```

### 常见问题

**问题：生成一直卡在 PROCESSING**
- 检查 Replicate API Token 是否正确
- 检查 webhook URL 是否公网可访问
- 查看服务器日志是否有错误

**问题：配额已用完**
- 检查 DailyUsage 表中的使用记录
- 升级到 PRO 计划解除限制

**问题：上传失败**
- 检查文件大小（最大 10MB）
- 检查文件格式（PNG、JPG、WebP、GIF）
- 确保 `public/uploads` 目录存在且可写

## 📝 提示词最佳实践

### 好的提示词示例

✅ **具体详细**
```
A cinematic aerial shot of a futuristic city at sunset,
with flying cars weaving between towering glass skyscrapers,
neon lights reflecting off wet streets, dramatic clouds in the sky
```

✅ **包含风格和氛围**
```
Oil painting style, a peaceful forest scene with golden
sunlight filtering through autumn leaves, soft focus,
warm color palette, gentle camera movement
```

### 不好的提示词示例

❌ **过于简单**
```
A city
```

❌ **缺少细节**
```
Something cool
```

## 🎯 下一步优化

- [ ] 添加视频编辑功能
- [ ] 支持更多 AI 模型
- [ ] 批量生成
- [ ] 视频模板库
- [ ] 社区分享功能
- [ ] 高级参数调节（运动强度、关键帧等）

---

**Need Help?** 查看 [Replicate 文档](https://replicate.com/docs) 或项目 README.md
