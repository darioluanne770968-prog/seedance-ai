import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkCredits, deductCredits } from '@/lib/credits'
import { withRateLimit } from '@/lib/rate-limit'
import { checkContent } from '@/lib/content-moderation'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

// Model configurations
const IMAGE_MODELS: Record<string, {
  model: string
  inputMapping: (input: any) => any
}> = {
  'sdxl': {
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    inputMapping: (input) => ({
      prompt: input.prompt,
      negative_prompt: input.negativePrompt || 'low quality, blurry, distorted',
      width: input.width || 1024,
      height: input.height || 1024,
      num_outputs: 1,
      scheduler: 'K_EULER',
      num_inference_steps: 30,
      guidance_scale: 7.5,
      seed: input.seed,
    }),
  },
  'flux': {
    model: 'black-forest-labs/flux-schnell',
    inputMapping: (input) => ({
      prompt: input.prompt,
      num_outputs: 1,
      aspect_ratio: getFluxAspectRatio(input.width, input.height),
      output_format: 'webp',
      output_quality: 90,
    }),
  },
  'dalle-3': {
    // Using SDXL as fallback since DALL-E 3 isn't on Replicate
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    inputMapping: (input) => ({
      prompt: `${input.prompt}, highly detailed, professional quality`,
      negative_prompt: input.negativePrompt || 'low quality, blurry, distorted',
      width: input.width || 1024,
      height: input.height || 1024,
      num_outputs: 1,
      scheduler: 'K_EULER',
      num_inference_steps: 40,
      guidance_scale: 8,
    }),
  },
  'midjourney': {
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    inputMapping: (input) => ({
      prompt: `${input.prompt}, midjourney style, artistic, highly detailed, 8k`,
      negative_prompt: input.negativePrompt || 'low quality, blurry',
      width: input.width || 1024,
      height: input.height || 1024,
      num_outputs: 1,
      scheduler: 'K_EULER',
      num_inference_steps: 35,
      guidance_scale: 7,
    }),
  },
  'ideogram': {
    model: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    inputMapping: (input) => ({
      prompt: input.prompt,
      negative_prompt: input.negativePrompt || 'blurry, low quality',
      width: input.width || 1024,
      height: input.height || 1024,
      num_outputs: 1,
      scheduler: 'K_EULER',
      num_inference_steps: 30,
      guidance_scale: 7.5,
    }),
  },
}

function getFluxAspectRatio(width: number, height: number): string {
  const ratio = width / height
  if (ratio > 1.7) return '16:9'
  if (ratio > 1.2) return '4:3'
  if (ratio < 0.6) return '9:16'
  if (ratio < 0.8) return '3:4'
  return '1:1'
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResponse = await withRateLimit(req, 'generate', session.user.id)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await req.json()
    const {
      prompt,
      negativePrompt,
      model = 'sdxl',
      width = 1024,
      height = 1024,
      title,
      seed,
    } = body

    // Validate
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Content moderation
    const moderationResult = await checkContent(session.user.id, prompt)
    if (!moderationResult.allowed) {
      return NextResponse.json(
        { error: moderationResult.reason || 'Content violates terms' },
        { status: 400 }
      )
    }

    // Check credits (10 credits per image)
    const creditsCheck = await checkCredits(session.user.id, 'text-to-image')
    if (!creditsCheck.allowed) {
      return NextResponse.json(
        { error: creditsCheck.message, upgradeRequired: true },
        { status: 429 }
      )
    }

    // Create image record
    const image = await prisma.image.create({
      data: {
        userId: session.user.id,
        title: title || prompt.slice(0, 50),
        prompt,
        negativePrompt,
        aiModel: model,
        width,
        height,
        seed,
        status: 'PENDING',
        aiProvider: 'replicate',
      },
    })

    // Get model config
    const modelConfig = IMAGE_MODELS[model] || IMAGE_MODELS['sdxl']
    const modelInput = modelConfig.inputMapping({ prompt, negativePrompt, width, height, seed })

    // Run prediction
    const prediction = await replicate.predictions.create({
      version: modelConfig.model.split(':')[1],
      input: modelInput,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate-image`,
      webhook_events_filter: ['completed'],
    })

    // Update image with task ID
    await prisma.image.update({
      where: { id: image.id },
      data: {
        aiTaskId: prediction.id,
        status: 'PROCESSING',
        progress: 10,
      },
    })

    // Deduct credits
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { credits: { decrement: 10 } },
    })

    await prisma.image.update({
      where: { id: image.id },
      data: { creditsUsed: 10 },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
