import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkCredits, deductCredits } from '@/lib/credits'
import { checkQuota, incrementDailyUsage } from '@/lib/quota'
import { withRateLimit } from '@/lib/rate-limit'
import { checkContent } from '@/lib/content-moderation'
import {
  generateTextToVideo,
  generateImageToVideo,
} from '@/lib/ai-providers'

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate limiting
    const rateLimitResponse = await withRateLimit(req, 'generate', session.user.id)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // 3. Parse request
    const body = await req.json()
    const {
      generationType,
      prompt,
      title,
      aiModel = 'seedance-1.5-pro',
      duration = 5,
      resolution = '720p',
      aspectRatio = '16:9',
      sourceImageUrl,
      seed,
    } = body

    // 4. Validate input
    if (!generationType || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (generationType === 'IMAGE_TO_VIDEO' && !sourceImageUrl) {
      return NextResponse.json(
        { error: 'Source image is required for image-to-video' },
        { status: 400 }
      )
    }

    // 5. Content moderation
    const moderationResult = await checkContent(session.user.id, prompt)
    if (!moderationResult.allowed) {
      return NextResponse.json(
        {
          error: moderationResult.reason || 'Content violates our terms of service',
          code: 'CONTENT_BLOCKED',
        },
        { status: 400 }
      )
    }

    // 6. Check quota (daily limits, resolution, model access)
    const quotaCheck = await checkQuota(session.user.id, duration, aiModel, resolution)
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: quotaCheck.message,
          upgradeRequired: quotaCheck.upgradeRequired,
          plan: quotaCheck.plan,
          remaining: quotaCheck.remaining,
        },
        { status: 429 }
      )
    }

    // 6. Check credits
    const creditsCheck = await checkCredits(session.user.id, aiModel)
    if (!creditsCheck.allowed) {
      return NextResponse.json(
        {
          error: creditsCheck.message,
          upgradeRequired: creditsCheck.upgradeRequired,
          currentCredits: creditsCheck.currentCredits,
          requiredCredits: creditsCheck.requiredCredits,
        },
        { status: 429 }
      )
    }

    // 7. Create video record
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title: title || `${aiModel} Video`,
        prompt,
        generationType,
        aiModel,
        duration,
        resolution,
        aspectRatio,
        sourceImageKey: sourceImageUrl,
        status: 'PENDING',
        progress: 0,
        seed,
        aiProvider: 'replicate',
        creditsUsed: 0,
      },
    })

    // 8. Start AI generation
    const result =
      generationType === 'TEXT_TO_VIDEO'
        ? await generateTextToVideo({
            type: 'text-to-video',
            prompt,
            duration,
            resolution,
            seed,
          })
        : await generateImageToVideo({
            type: 'image-to-video',
            prompt,
            imageUrl: sourceImageUrl,
            duration,
            seed,
          })

    // 9. Handle generation failure
    if (result.status === 'failed') {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'FAILED',
          errorMessage: result.error || 'AI generation failed',
        },
      })
      return NextResponse.json(
        { error: result.error || 'AI generation failed' },
        { status: 500 }
      )
    }

    // 10. Deduct credits after successful generation start
    try {
      await deductCredits(session.user.id, aiModel, video.id)
    } catch (error) {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'FAILED',
          errorMessage: 'Failed to deduct credits',
        },
      })
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      )
    }

    // 11. Increment daily usage for quota tracking
    await incrementDailyUsage(session.user.id, duration)

    // 12. Update video with AI task ID
    await prisma.video.update({
      where: { id: video.id },
      data: {
        aiTaskId: result.taskId,
        status: 'PROCESSING',
        progress: 10,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Generate video error:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}
