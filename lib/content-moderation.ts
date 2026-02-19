/**
 * Content moderation for prompts and generated content
 */

// Blocked words and patterns (simplified list - expand as needed)
const BLOCKED_WORDS = [
  // Violence
  'kill', 'murder', 'suicide', 'bomb', 'terrorist', 'shooting', 'massacre',
  // Adult content
  'nude', 'naked', 'porn', 'xxx', 'nsfw', 'explicit', 'erotic',
  // Hate speech
  'racist', 'nazi', 'supremacist',
  // Illegal activities
  'drug dealing', 'trafficking',
]

const BLOCKED_PATTERNS = [
  /child\s*(porn|abuse|exploitation)/i,
  /minor\s*(nude|naked|sexual)/i,
  /(deep\s*fake|deepfake)\s*(porn|nude)/i,
  /revenge\s*porn/i,
  /non\s*consensual/i,
]

export interface ModerationResult {
  allowed: boolean
  flagged: boolean
  reason?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  blockedTerms?: string[]
}

/**
 * Check if prompt contains blocked content
 */
export function moderatePrompt(prompt: string): ModerationResult {
  const normalizedPrompt = prompt.toLowerCase().trim()

  // Check for blocked patterns first (highest severity)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(normalizedPrompt)) {
      return {
        allowed: false,
        flagged: true,
        reason: 'Content violates our terms of service',
        severity: 'critical',
      }
    }
  }

  // Check for blocked words
  const foundBlockedWords: string[] = []
  for (const word of BLOCKED_WORDS) {
    if (normalizedPrompt.includes(word)) {
      foundBlockedWords.push(word)
    }
  }

  if (foundBlockedWords.length > 0) {
    // Determine severity based on words found
    const severity = foundBlockedWords.length > 2 ? 'high' : 'medium'

    return {
      allowed: false,
      flagged: true,
      reason: 'Prompt contains inappropriate content',
      severity,
      blockedTerms: foundBlockedWords,
    }
  }

  // Check for suspicious patterns that might be attempts to bypass filters
  const suspiciousPatterns = [
    /\b(n|\/\/|0|@)\s*(u|\/\/|0)\s*(d|\/\/)\s*(e|3)/i, // Obfuscated "nude"
    /\b(p|\/\/|0)\s*(o|\/\/|0)\s*(r|\/\/)\s*(n|\/\/)/i, // Obfuscated "porn"
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(normalizedPrompt)) {
      return {
        allowed: false,
        flagged: true,
        reason: 'Suspicious content detected',
        severity: 'medium',
      }
    }
  }

  // Content is allowed
  return {
    allowed: true,
    flagged: false,
  }
}

/**
 * Check if prompt should be flagged for manual review
 */
export function shouldFlagForReview(prompt: string): boolean {
  const normalizedPrompt = prompt.toLowerCase()

  // Words that might need human review but aren't automatically blocked
  const reviewWords = [
    'violence', 'blood', 'weapon', 'gun', 'knife',
    'sexy', 'bikini', 'lingerie',
    'death', 'dead', 'dying',
    'drugs', 'alcohol', 'smoke',
  ]

  return reviewWords.some(word => normalizedPrompt.includes(word))
}

/**
 * Sanitize prompt to remove potentially harmful content
 */
export function sanitizePrompt(prompt: string): string {
  let sanitized = prompt

  // Remove excess whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  // Remove special characters that might be used to bypass filters
  sanitized = sanitized.replace(/[^\w\s,.!?'-]/g, '')

  // Limit length
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000)
  }

  return sanitized
}

/**
 * Get moderation category for analytics
 */
export function getModerationCategory(result: ModerationResult): string {
  if (!result.flagged) return 'clean'
  if (result.severity === 'critical') return 'critical_violation'
  if (result.severity === 'high') return 'high_violation'
  if (result.severity === 'medium') return 'medium_violation'
  return 'low_violation'
}

/**
 * Log moderation event (for audit trail)
 */
export async function logModerationEvent(
  userId: string,
  prompt: string,
  result: ModerationResult,
  action: 'blocked' | 'flagged' | 'allowed'
) {
  // In production, you would log this to a database or analytics service
  console.log('[MODERATION]', {
    userId,
    promptLength: prompt.length,
    result: {
      allowed: result.allowed,
      flagged: result.flagged,
      severity: result.severity,
    },
    action,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Combined moderation check
 */
export async function checkContent(
  userId: string,
  prompt: string
): Promise<ModerationResult> {
  // Sanitize first
  const sanitized = sanitizePrompt(prompt)

  // Run moderation
  const result = moderatePrompt(sanitized)

  // Log the event
  const action = result.allowed ? 'allowed' : (result.severity === 'critical' ? 'blocked' : 'flagged')
  await logModerationEvent(userId, prompt, result, action)

  return result
}
