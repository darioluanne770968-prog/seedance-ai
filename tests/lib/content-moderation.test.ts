import { describe, it, expect } from 'vitest'
import {
  moderatePrompt,
  sanitizePrompt,
  shouldFlagForReview,
} from '@/lib/content-moderation'

describe('Content Moderation', () => {
  describe('moderatePrompt', () => {
    it('should allow clean prompts', () => {
      const result = moderatePrompt('A beautiful sunset over the ocean')
      expect(result.allowed).toBe(true)
      expect(result.flagged).toBe(false)
    })

    it('should block prompts with blocked words', () => {
      const result = moderatePrompt('A scene with nude people')
      expect(result.allowed).toBe(false)
      expect(result.flagged).toBe(true)
      expect(result.blockedTerms).toContain('nude')
    })

    it('should detect critical patterns', () => {
      const result = moderatePrompt('child exploitation')
      expect(result.allowed).toBe(false)
      expect(result.severity).toBe('critical')
    })

    it('should handle case insensitivity', () => {
      const result = moderatePrompt('NUDE SCENE')
      expect(result.allowed).toBe(false)
    })
  })

  describe('sanitizePrompt', () => {
    it('should remove excess whitespace', () => {
      const result = sanitizePrompt('  hello    world  ')
      expect(result).toBe('hello world')
    })

    it('should remove special characters', () => {
      const result = sanitizePrompt('hello@world#test')
      expect(result).toBe('helloworld test')
    })

    it('should truncate long prompts', () => {
      const longPrompt = 'a'.repeat(2000)
      const result = sanitizePrompt(longPrompt)
      expect(result.length).toBe(1000)
    })
  })

  describe('shouldFlagForReview', () => {
    it('should flag prompts with review words', () => {
      expect(shouldFlagForReview('A violent scene')).toBe(true)
      expect(shouldFlagForReview('Person with a gun')).toBe(true)
      expect(shouldFlagForReview('Sexy outfit')).toBe(true)
    })

    it('should not flag clean prompts', () => {
      expect(shouldFlagForReview('A peaceful garden')).toBe(false)
      expect(shouldFlagForReview('Happy children playing')).toBe(false)
    })
  })
})
