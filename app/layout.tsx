import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seedance.ai'
const siteName = process.env.NEXT_PUBLIC_APP_NAME || 'Seedance AI'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Transform Ideas into Cinematic AI Videos`,
    template: `%s | ${siteName}`
  },
  description: 'Create stunning AI-generated videos from text prompts or images. Professional-quality video generation powered by cutting-edge AI models like Seedance 2.0, Sora 2, and Veo 3.',
  keywords: [
    'AI video generator',
    'text to video',
    'image to video',
    'AI video',
    'video generator',
    'Seedance',
    'Sora alternative',
    'AI video creation',
    'video AI',
    'generative AI video',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: siteUrl,
    title: `${siteName} - AI Video Generation Platform`,
    description: 'Transform your ideas into stunning cinematic videos with AI. Text-to-video and image-to-video generation.',
    siteName: siteName,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteName} - AI Video Generator`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - AI Video Generator`,
    description: 'Create stunning AI-generated videos from text or images',
    images: ['/og-image.png'],
    creator: '@seedance_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': `${siteUrl}/en`,
      'zh-CN': `${siteUrl}/zh`,
    },
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteName,
  description: 'AI-powered video generation platform',
  url: siteUrl,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
