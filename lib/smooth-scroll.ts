import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

/**
 * Initialize smooth scrolling with Lenis
 * Integrates with GSAP ticker for ScrollTrigger compatibility
 */
export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  })

  // Integrate with GSAP ticker
  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // Update ScrollTrigger on scroll
  lenis.on('scroll', ScrollTrigger.update)

  // Sync ScrollTrigger with Lenis scroll
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

/**
 * Cleanup smooth scroll
 */
export const destroySmoothScroll = () => {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

