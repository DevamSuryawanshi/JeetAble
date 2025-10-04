import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AccessibilityProvider } from '@/components/AccessibilityProvider'
import AIAgent from '@/components/AIAgent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JeetAble - Empowering Digital Accessibility',
  description: 'A comprehensive platform helping disabled users learn, communicate, and navigate the web with ease.',
  keywords: 'accessibility, disability support, voice assistant, deaf mode, learning hub',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccessibilityProvider>
          {children}
          <AIAgent />
        </AccessibilityProvider>
      </body>
    </html>
  )
}