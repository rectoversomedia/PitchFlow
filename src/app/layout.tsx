import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pitchflow.vercel.app'),
  title: {
    default: 'PitchFlow - AI-Powered Sponsorship Proposals',
    template: '%s | PitchFlow',
  },
  description: 'AI-assisted sponsorship proposal workspace that helps teams turn Sales briefs into stronger sponsorship proposals through structured intake, proposal library, AI-powered idea generation, and Sales collaboration.',
  keywords: [
    'sponsorship',
    'proposal',
    'AI',
    'media',
    'sales',
    'pitch',
    'branding',
    'advertising',
    'marketing',
    'Indonesia',
  ],
  authors: [{ name: 'Rectoverso Media', url: 'https://rectoverso.com' }],
  creator: 'Rectoverso Media',
  publisher: 'Rectoverso Media',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'PitchFlow',
    title: 'PitchFlow - AI-Powered Sponsorship Proposals',
    description: 'AI-assisted sponsorship proposal workspace that helps teams turn Sales briefs into stronger sponsorship proposals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PitchFlow - AI-Powered Sponsorship Proposals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PitchFlow - AI-Powered Sponsorship Proposals',
    description: 'AI-assisted sponsorship proposal workspace that helps teams turn Sales briefs into stronger sponsorship proposals.',
    images: ['/og-image.png'],
    creator: '@rectoverso',
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
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232563EB' rx='20' width='100' height='100'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='50' font-weight='bold'>PF</text></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
