'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap, ensureScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    let lenis: Lenis | null = null
    let tickerFn: ((time: number) => void) | null = null
    let mounted = true

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!mounted) return

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      })

      if (ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update)
      }

      tickerFn = (time: number) => {
        // GSAP ticker is seconds; Lenis expects ms.
        lenis?.raf(time * 1000)
      }

      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      // Ensure ScrollTrigger measures after Lenis is active.
      ScrollTrigger?.refresh()
    }

    void setup()

    return () => {
      mounted = false
      if (tickerFn) gsap.ticker.remove(tickerFn)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return <>{children}</>
}


