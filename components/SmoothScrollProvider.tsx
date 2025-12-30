'use client'

import { useEffect, useLayoutEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap, ensureScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

// Use useLayoutEffect on client for earlier execution
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return

    let lenis: Lenis | null = null
    let tickerFn: ((time: number) => void) | null = null
    let mounted = true

    // Initialize Lenis immediately (don't wait for ScrollTrigger)
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

    tickerFn = (time: number) => {
      lenis?.raf(time * 1000)
    }

    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // Connect to ScrollTrigger when it's ready (async)
    const connectScrollTrigger = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!mounted || !lenis || !ScrollTrigger) return

      lenis.on('scroll', ScrollTrigger.update)

      // Delay refresh to let all components initialize
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (mounted) {
            ScrollTrigger.refresh()
          }
        })
      })
    }

    connectScrollTrigger()

    return () => {
      mounted = false
      if (tickerFn) gsap.ticker.remove(tickerFn)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return <>{children}</>
}
