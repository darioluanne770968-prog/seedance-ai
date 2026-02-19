import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { existsSync } from 'fs'
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize R2 client (S3-compatible)
const r2Client = process.env.R2_ACCOUNT_ID ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
}) : null

const isProduction = process.env.NODE_ENV === 'production'
const useR2 = r2Client && (isProduction || process.env.USE_R2 === 'true')

/**
 * Upload file to R2 (production) or local storage (development)
 */
export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string; key: string }> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const key = `${folder}/${randomUUID()}.${ext}`

  if (useR2 && r2Client) {
    return uploadToR2(buffer, key, file.type)
  }

  return uploadToLocal(buffer, key)
}

/**
 * Upload buffer to R2
 */
async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  if (!r2Client) {
    throw new Error('R2 client not initialized')
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : await getSignedUrl(r2Client, new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }), { expiresIn: 86400 }) // 24 hours

  return { url: publicUrl, key }
}

/**
 * Upload buffer to local storage
 */
async function uploadToLocal(
  buffer: Buffer,
  key: string
): Promise<{ url: string; key: string }> {
  const uploadDir = join(process.cwd(), 'public', 'uploads')

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const filename = key.split('/').pop() || key
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/uploads/${filename}`

  return { url, key: `uploads/${filename}` }
}

/**
 * Upload video output from AI provider
 */
export async function uploadVideoFromUrl(
  videoUrl: string,
  userId: string
): Promise<{ url: string; key: string }> {
  const response = await fetch(videoUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch video from URL')
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const key = `videos/${userId}/${randomUUID()}.mp4`
  const contentType = response.headers.get('content-type') || 'video/mp4'

  if (useR2 && r2Client) {
    return uploadToR2(buffer, key, contentType)
  }

  return uploadToLocal(buffer, key)
}

/**
 * Delete file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  if (useR2 && r2Client) {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    )
    return
  }

  // Local deletion
  const filename = key.split('/').pop() || key
  const filepath = join(process.cwd(), 'public', 'uploads', filename)

  if (existsSync(filepath)) {
    await unlink(filepath)
  }
}

/**
 * Generate presigned upload URL for direct client upload
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
  const key = `${folder}/${randomUUID()}.${ext}`

  if (!useR2 || !r2Client) {
    throw new Error('Presigned URLs only available with R2 storage')
  }

  const { PutObjectCommand } = await import('@aws-sdk/client-s3')

  const uploadUrl = await getSignedUrl(
    r2Client,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 } // 1 hour
  )

  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : ''

  return { uploadUrl, key, publicUrl }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
  }

  if (file.size > maxSize) {
    return 'File size must be less than 10MB'
  }

  return null
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): string | null {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
  const maxSize = 500 * 1024 * 1024 // 500MB

  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid video file (MP4, WebM, or MOV)'
  }

  if (file.size > maxSize) {
    return 'File size must be less than 500MB'
  }

  return null
}

/**
 * Get public URL for a stored file key
 */
export function getFileUrl(key: string): string {
  if (useR2 && process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${key}`
  }

  // Local URL
  const filename = key.split('/').pop() || key
  return `${process.env.NEXT_PUBLIC_APP_URL}/uploads/${filename}`
}
