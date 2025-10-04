import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AnimatedGradientBackground from "@/components/ui/simple-gradient-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "Extension Builder - Create Guided Workflows",
  description: "Build Chrome extensions with guided workflows and annotations",
  generator: "v0.app",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="relative min-h-screen">
          {/* Animated Gradient Background */}
          <AnimatedGradientBackground />
          
          <div className="relative z-10">
            <Suspense fallback={null}>
              {children}
              <Analytics />
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  )
}
