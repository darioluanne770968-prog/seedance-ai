import Replicate from 'replicate'

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
})

export interface VideoGenerationInput {
  type: 'text-to-video' | 'image-to-video'
  prompt: string
  imageUrl?: string
  duration?: number
  resolution?: string
  aspectRatio?: string
  seed?: number
  style?: string
  model?: string
}

export interface VideoGenerationResult {
  taskId: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed'
  videoUrl?: string
  error?: string
}

// Model configurations with Replicate model IDs
export const MODEL_CONFIGS: Record<string, {
  name: string
  displayName: string
  type: 'text-to-video' | 'image-to-video' | 'both'
  replicateModel: string
  maxDuration: number
  defaultParams: Record<string, any>
  inputMapping: (input: VideoGenerationInput) => Record<string, any>
}> = {
  // Seedance models (using AnimateDiff as base)
  'seedance-2': {
    name: 'seedance-2',
    displayName: 'Seedance 2.0',
    type: 'text-to-video',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 10,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: `${input.prompt}, high quality, cinematic, 4k, detailed`,
      num_frames: Math.min((input.duration || 5) * 8, 80),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },
  'seedance-1.5-pro': {
    name: 'seedance-1.5-pro',
    displayName: 'Seedance 1.5 Pro',
    type: 'text-to-video',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 8,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: input.prompt,
      num_frames: Math.min((input.duration || 5) * 8, 64),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Sora-like (using Stable Video Diffusion as alternative)
  'sora-2': {
    name: 'sora-2',
    displayName: 'Sora 2',
    type: 'text-to-video',
    replicateModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    maxDuration: 6,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: input.prompt,
      video_length: input.duration === 6 ? 'long' : 'short',
      sizing_strategy: input.aspectRatio === '16:9' ? 'maintain_aspect_ratio' : 'crop_to_square',
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Veo 3 (using AnimateDiff with specific prompts)
  'veo-3': {
    name: 'veo-3',
    displayName: 'Veo 3',
    type: 'text-to-video',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 8,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: `${input.prompt}, ultra realistic, professional cinematography`,
      num_frames: Math.min((input.duration || 5) * 8, 64),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Wan 2.5 with audio (simulated)
  'wan-2.5': {
    name: 'wan-2.5',
    displayName: 'Wan 2.5',
    type: 'text-to-video',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 10,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: `${input.prompt}, smooth motion, high fidelity`,
      num_frames: Math.min((input.duration || 5) * 8, 80),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Kling AI
  'kling-ai': {
    name: 'kling-ai',
    displayName: 'Kling AI',
    type: 'both',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 10,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: input.prompt,
      num_frames: Math.min((input.duration || 5) * 8, 80),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Hailuo AI
  'hailuo-ai': {
    name: 'hailuo-ai',
    displayName: 'Hailuo AI',
    type: 'text-to-video',
    replicateModel: 'lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663',
    maxDuration: 6,
    defaultParams: {},
    inputMapping: (input) => ({
      prompt: `${input.prompt}, anime style, vibrant colors`,
      num_frames: Math.min((input.duration || 5) * 8, 48),
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Image to Video models
  'stable-video-diffusion': {
    name: 'stable-video-diffusion',
    displayName: 'Stable Video Diffusion',
    type: 'image-to-video',
    replicateModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    maxDuration: 4,
    defaultParams: {
      cond_aug: 0.02,
      decoding_t: 14,
      motion_bucket_id: 127,
    },
    inputMapping: (input) => ({
      input_image: input.imageUrl,
      video_length: 'short',
      sizing_strategy: 'maintain_aspect_ratio',
      frames_per_second: 8,
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Luma Ray for image-to-video
  'luma-ray': {
    name: 'luma-ray',
    displayName: 'Luma Ray',
    type: 'image-to-video',
    replicateModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    maxDuration: 5,
    defaultParams: {},
    inputMapping: (input) => ({
      input_image: input.imageUrl,
      video_length: input.duration && input.duration > 3 ? 'long' : 'short',
      sizing_strategy: 'maintain_aspect_ratio',
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Image models - Nano Banana Pro
  'nano-banana-pro': {
    name: 'nano-banana-pro',
    displayName: 'Nano Banana Pro',
    type: 'image-to-video',
    replicateModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    maxDuration: 4,
    defaultParams: {},
    inputMapping: (input) => ({
      input_image: input.imageUrl,
      video_length: 'short',
      sizing_strategy: 'maintain_aspect_ratio',
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },

  // Seedream 4.0
  'seedream-4': {
    name: 'seedream-4',
    displayName: 'Seedream 4.0',
    type: 'image-to-video',
    replicateModel: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
    maxDuration: 5,
    defaultParams: {},
    inputMapping: (input) => ({
      input_image: input.imageUrl,
      video_length: 'short',
      sizing_strategy: 'crop_to_square',
      seed: input.seed || Math.floor(Math.random() * 1000000),
    }),
  },
}

// Get model config by name (with fallback)
function getModelConfig(modelName: string) {
  const config = MODEL_CONFIGS[modelName]
  if (config) return config

  // Try to find by partial match
  const key = Object.keys(MODEL_CONFIGS).find(k =>
    k.toLowerCase() === modelName.toLowerCase() ||
    MODEL_CONFIGS[k].displayName.toLowerCase() === modelName.toLowerCase()
  )

  return key ? MODEL_CONFIGS[key] : MODEL_CONFIGS['seedance-1.5-pro']
}

/**
 * Generate video using text prompt
 */
export async function generateTextToVideo(
  input: VideoGenerationInput
): Promise<VideoGenerationResult> {
  try {
    const modelConfig = getModelConfig(input.model || 'seedance-1.5-pro')

    // Get model-specific input parameters
    const modelInput = modelConfig.inputMapping(input)

    // Extract version from model string
    const version = modelConfig.replicateModel.split(':')[1]

    const prediction = await replicate.predictions.create({
      version,
      input: modelInput,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate`,
      webhook_events_filter: ['completed'],
    })

    return {
      taskId: prediction.id,
      status: prediction.status === 'starting' ? 'starting' : 'processing',
    }
  } catch (error) {
    console.error('Text-to-video generation error:', error)
    return {
      taskId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate video from image
 */
export async function generateImageToVideo(
  input: VideoGenerationInput
): Promise<VideoGenerationResult> {
  try {
    if (!input.imageUrl) {
      throw new Error('Image URL is required for image-to-video generation')
    }

    // Default to stable-video-diffusion for image-to-video
    const modelConfig = getModelConfig(input.model || 'stable-video-diffusion')

    // Get model-specific input parameters
    const modelInput = modelConfig.inputMapping(input)

    // Extract version from model string
    const version = modelConfig.replicateModel.split(':')[1]

    const prediction = await replicate.predictions.create({
      version,
      input: modelInput,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/replicate`,
      webhook_events_filter: ['completed'],
    })

    return {
      taskId: prediction.id,
      status: prediction.status === 'starting' ? 'starting' : 'processing',
    }
  } catch (error) {
    console.error('Image-to-video generation error:', error)
    return {
      taskId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get prediction status
 */
export async function getPredictionStatus(
  taskId: string
): Promise<VideoGenerationResult> {
  try {
    const prediction = await replicate.predictions.get(taskId)

    return {
      taskId: prediction.id,
      status: mapReplicateStatus(prediction.status),
      videoUrl: Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output,
      error: prediction.error,
    }
  } catch (error) {
    console.error('Get prediction status error:', error)
    return {
      taskId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Cancel a running prediction
 */
export async function cancelPrediction(taskId: string): Promise<boolean> {
  try {
    await replicate.predictions.cancel(taskId)
    return true
  } catch (error) {
    console.error('Cancel prediction error:', error)
    return false
  }
}

/**
 * Map Replicate status to our status
 */
function mapReplicateStatus(
  status: string
): 'starting' | 'processing' | 'succeeded' | 'failed' {
  switch (status) {
    case 'starting':
      return 'starting'
    case 'processing':
      return 'processing'
    case 'succeeded':
      return 'succeeded'
    case 'failed':
    case 'canceled':
      return 'failed'
    default:
      return 'processing'
  }
}

/**
 * Get available models for a generation type
 */
export function getAvailableModels(type: 'text-to-video' | 'image-to-video') {
  return Object.entries(MODEL_CONFIGS)
    .filter(([_, config]) => config.type === type || config.type === 'both')
    .map(([id, config]) => ({
      id,
      name: config.displayName,
      maxDuration: config.maxDuration,
    }))
}

/**
 * Check if a model exists
 */
export function isValidModel(modelName: string): boolean {
  return !!MODEL_CONFIGS[modelName] || Object.values(MODEL_CONFIGS).some(
    c => c.name === modelName || c.displayName === modelName
  )
}

/**
 * Get model max duration
 */
export function getModelMaxDuration(modelName: string): number {
  const config = getModelConfig(modelName)
  return config.maxDuration
}
