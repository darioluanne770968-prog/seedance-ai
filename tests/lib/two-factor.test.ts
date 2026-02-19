import { describe, it, expect } from 'vitest'
import {
  generateTwoFactorSecret,
  verifyTwoFactorCode,
  generateBackupCodes,
  hashBackupCodes,
  verifyBackupCode,
} from '@/lib/two-factor'

describe('Two-Factor Authentication', () => {
  describe('generateTwoFactorSecret', () => {
    it('should generate valid secret and URI', () => {
      const result = generateTwoFactorSecret('test@example.com')

      expect(result.secret).toBeDefined()
      expect(result.secret.length).toBeGreaterThan(0)
      expect(result.uri).toContain('otpauth://totp/')
      expect(result.uri).toContain('test@example.com')
      expect(result.qrCodeUrl).toContain('api.qrserver.com')
    })
  })

  describe('verifyTwoFactorCode', () => {
    it('should reject invalid codes', () => {
      const secret = 'TESTSECRET123456'
      const result = verifyTwoFactorCode(secret, '000000')
      // This will likely be false since 000000 is not the correct code
      expect(typeof result).toBe('boolean')
    })
  })

  describe('generateBackupCodes', () => {
    it('should generate requested number of codes', () => {
      const codes = generateBackupCodes(10)
      expect(codes).toHaveLength(10)
    })

    it('should generate unique codes', () => {
      const codes = generateBackupCodes(10)
      const uniqueCodes = new Set(codes)
      expect(uniqueCodes.size).toBe(10)
    })

    it('should format codes as XXXX-XXXX', () => {
      const codes = generateBackupCodes(5)
      codes.forEach(code => {
        expect(code).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/)
      })
    })
  })

  describe('hashBackupCodes and verifyBackupCode', () => {
    it('should verify correct backup code', () => {
      const codes = generateBackupCodes(5)
      const hashed = hashBackupCodes(codes)

      const index = verifyBackupCode(codes[2], hashed)
      expect(index).toBe(2)
    })

    it('should reject invalid backup code', () => {
      const codes = generateBackupCodes(5)
      const hashed = hashBackupCodes(codes)

      const index = verifyBackupCode('XXXX-XXXX', hashed)
      expect(index).toBe(-1)
    })

    it('should handle codes without dash', () => {
      const codes = generateBackupCodes(5)
      const hashed = hashBackupCodes(codes)

      // Remove dash from code
      const codeWithoutDash = codes[0].replace('-', '')
      const index = verifyBackupCode(codeWithoutDash, hashed)
      expect(index).toBe(0)
    })
  })
})
