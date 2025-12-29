'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smooth-scroll'
import Nav from './Nav'
import Footer from './Footer'
import PageTransition from './PageTransition'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    initSmoothScroll()
    return () => {
      destroySmoothScroll()
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <PageTransition key={pathname}>
        <main className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
    </div>
  )
}

