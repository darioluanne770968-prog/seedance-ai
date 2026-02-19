import { authenticator } from 'otpauth'
import * as crypto from 'crypto'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Seedance'

/**
 * Generate a new TOTP secret for 2FA setup
 */
export function generateTwoFactorSecret(email: string): {
  secret: string
  uri: string
  qrCodeUrl: string
} {
  // Generate a random secret
  const secret = crypto.randomBytes(20).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)

  // Create TOTP instance
  const totp = new authenticator.TOTP({
    issuer: APP_NAME,
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  })

  const uri = totp.toString()

  // QR code URL using Google Charts API (for simplicity)
  // In production, generate QR code server-side
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`

  return {
    secret,
    uri,
    qrCodeUrl,
  }
}

/**
 * Verify a TOTP code
 */
export function verifyTwoFactorCode(secret: string, code: string): boolean {
  try {
    const totp = new authenticator.TOTP({
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })

    // Allow a time window of +/- 1 period (30 seconds) for clock skew
    const delta = totp.validate({ token: code, window: 1 })

    return delta !== null
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

/**
 * Generate backup codes for account recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []

  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric codes
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    // Format as XXXX-XXXX for readability
    codes.push(`${code.substring(0, 4)}-${code.substring(4)}`)
  }

  return codes
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(code =>
    crypto.createHash('sha256').update(code.replace('-', '')).digest('hex')
  )
}

/**
 * Verify a backup code
 */
export function verifyBackupCode(code: string, hashedCodes: string[]): number {
  const normalizedCode = code.replace('-', '').toUpperCase()
  const hashedInput = crypto.createHash('sha256').update(normalizedCode).digest('hex')

  const index = hashedCodes.findIndex(hashed => hashed === hashedInput)
  return index
}
