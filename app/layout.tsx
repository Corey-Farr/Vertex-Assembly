import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GlobalLayout from '@/components/layout/GlobalLayout'
import { defaultMetadata } from './metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  )
}

