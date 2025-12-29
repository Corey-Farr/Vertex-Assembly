import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'
import { defaultMetadata } from './metadata'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

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
  const debugGrid = process.env.NEXT_PUBLIC_DEBUG_GRID === 'true'

  return (
    <html lang="en" className={clsx(inter.variable, 'dark', debugGrid && 'debug-grid')}>
      <body>
        <SmoothScrollProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageTransition>
              {/* Pull the page background under the transparent navbar while keeping content below it */}
              <main className="flex-1 pt-20 -mt-20">{children}</main>
            </PageTransition>
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}

