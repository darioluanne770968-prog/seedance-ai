import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'Seedance <noreply@seedance.ai>'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Seedance'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3456'

export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

// Email verification
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Verify your ${APP_NAME} account`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">Verify your email address</h2>

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: center;">
              Thanks for signing up! Please verify your email address to get started with AI video generation.
            </p>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Verify Email
              </a>
            </div>

            <p style="color: #71717a; font-size: 14px; text-align: center; margin-bottom: 16px;">
              Or copy and paste this link:
            </p>
            <p style="color: #3b82f6; font-size: 12px; word-break: break-all; text-align: center; background: rgba(59,130,246,0.1); padding: 12px; border-radius: 8px;">
              ${verifyUrl}
            </p>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Password reset
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">Reset your password</h2>

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: center;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="color: #71717a; font-size: 14px; text-align: center; margin-bottom: 16px;">
              Or copy and paste this link:
            </p>
            <p style="color: #3b82f6; font-size: 12px; word-break: break-all; text-align: center; background: rgba(59,130,246,0.1); padding: 12px; border-radius: 8px;">
              ${resetUrl}
            </p>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Video generation complete
export async function sendVideoCompleteEmail(email: string, videoTitle: string, videoUrl: string, thumbnailUrl?: string) {
  const viewUrl = `${APP_URL}/videos`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your video "${videoTitle}" is ready!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ✓ Video Complete
              </span>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">${videoTitle}</h2>

            ${thumbnailUrl ? `
              <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden;">
                <img src="${thumbnailUrl}" alt="Video thumbnail" style="width: 100%; display: block;" />
              </div>
            ` : ''}

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: center;">
              Great news! Your AI-generated video is ready to view and download.
            </p>

            <div style="text-align: center; margin-bottom: 16px;">
              <a href="${viewUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View My Videos
              </a>
            </div>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              Want to create more? You can generate unlimited AI videos with your ${APP_NAME} subscription.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Video generation failed
export async function sendVideoFailedEmail(email: string, videoTitle: string, reason?: string) {
  const createUrl = `${APP_URL}/create`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Video generation failed: ${videoTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: rgba(239,68,68,0.2); color: #ef4444; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ✗ Generation Failed
              </span>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">${videoTitle}</h2>

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; text-align: center;">
              Unfortunately, we couldn't generate your video. Don't worry - your credits have been refunded.
            </p>

            ${reason ? `
              <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 12px; margin-bottom: 24px;">
                <p style="color: #fca5a5; font-size: 14px; margin: 0; text-align: center;">${reason}</p>
              </div>
            ` : ''}

            <div style="text-align: center; margin-bottom: 16px;">
              <a href="${createUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Try Again
              </a>
            </div>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              Tips: Try using a different prompt or adjusting your settings. If the problem persists, contact support.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Welcome email after registration
export async function sendWelcomeEmail(email: string, name?: string) {
  const createUrl = `${APP_URL}/create`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 16px; text-align: center;">
              Welcome${name ? `, ${name}` : ''}! 🎉
            </h2>

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; text-align: center;">
              You've joined the future of video creation. With ${APP_NAME}, you can transform your ideas into stunning AI-generated videos in seconds.
            </p>

            <div style="background: rgba(59,130,246,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Your free account includes:</h3>
              <ul style="color: #a1a1aa; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>100 credits per month</li>
                <li>Access to basic AI models</li>
                <li>720p video resolution</li>
                <li>Standard queue priority</li>
              </ul>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${createUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Create Your First Video
              </a>
            </div>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              Need more credits? <a href="${APP_URL}/pricing" style="color: #3b82f6;">Upgrade your plan</a> for unlimited creative possibilities.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Payment confirmation
export async function sendPaymentConfirmationEmail(
  email: string,
  plan: string,
  amount: number,
  credits: number
) {
  const billingUrl = `${APP_URL}/account/billing`

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Payment confirmed - ${APP_NAME} ${plan}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); border-radius: 12px; padding: 12px;">
                <span style="font-size: 24px; font-weight: bold; color: white;">▶</span>
              </div>
              <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 600;">${APP_NAME}</h1>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                ✓ Payment Confirmed
              </span>
            </div>

            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px; text-align: center;">
              Thank you for upgrading to ${plan}!
            </h2>

            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #a1a1aa;">Plan</span>
                <span style="font-weight: 600;">${plan}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #a1a1aa;">Amount</span>
                <span style="font-weight: 600;">$${(amount / 100).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #a1a1aa;">Monthly Credits</span>
                <span style="font-weight: 600; color: #22d3ee;">${credits.toLocaleString()}</span>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 16px;">
              <a href="${billingUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #22d3ee 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Billing Details
              </a>
            </div>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin-top: 32px;">
              You can manage your subscription anytime from your account settings.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}
