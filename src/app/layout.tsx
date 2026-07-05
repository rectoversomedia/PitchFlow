import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "PitchFlow by Rectoverso",
  description: "AI-assisted sponsorship proposal workspace that helps teams turn Sales briefs into stronger sponsorship proposals through structured intake, proposal library, AI-powered idea generation, and Sales collaboration.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232563EB' rx='20' width='100' height='100'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='50' font-weight='bold'>PF</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
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
