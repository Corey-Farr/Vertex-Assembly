import { gsap } from 'gsap'

export const isBrowser = typeof window !== 'undefined'

let scrollTriggerRegistered = false

export function prefersReducedMotion(): boolean {
  if (!isBrowser) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scale down animation durations when the user prefers reduced motion.
 * Keep non-zero to avoid edge-case glitches with timelines.
 */
export function motionDuration(seconds: number): number {
  if (!prefersReducedMotion()) return seconds
  return Math.min(0.01, seconds)
}

/**
 * SSR-safe plugin registration. ScrollTrigger is dynamically imported so it
 * never evaluates in a non-browser runtime.
 */
export async function ensureScrollTrigger() {
  if (!isBrowser) return null
  const mod = await import('gsap/ScrollTrigger')
  const ScrollTrigger = mod.ScrollTrigger
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    scrollTriggerRegistered = true
  }
  return ScrollTrigger
}

export { gsap }


