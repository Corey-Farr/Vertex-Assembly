'use client'

import { useEffect, useLayoutEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/gsap'

// Register ScrollTrigger synchronously at module load
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Use useLayoutEffect on client for earlier execution
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return

    // Create Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    // Sync ScrollTrigger with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP ticker (time is in seconds, Lenis expects ms)
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after images load
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })

    // Also refresh after a short delay for any late-mounting components
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    return () => {
      window.removeEventListener('load', refresh)
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
