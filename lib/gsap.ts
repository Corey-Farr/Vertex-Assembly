import { gsap } from 'gsap'

export const isBrowser = typeof window !== 'undefined'

let scrollTriggerRegistered = false
let scrollTriggerPromise: Promise<typeof import('gsap/ScrollTrigger').ScrollTrigger> | null = null

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
 * 
 * Uses a singleton promise to ensure only one import happens even if called
 * multiple times in parallel.
 */
export async function ensureScrollTrigger() {
  if (!isBrowser) return null
  
  // Return cached promise if already loading/loaded
  if (scrollTriggerPromise) {
    return scrollTriggerPromise
  }
  
  scrollTriggerPromise = import('gsap/ScrollTrigger').then((mod) => {
    const ScrollTrigger = mod.ScrollTrigger
    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger)
      scrollTriggerRegistered = true
    }
    return ScrollTrigger
  })
  
  return scrollTriggerPromise
}

// Pre-load ScrollTrigger immediately on module load (browser only)
// This ensures it's ready by the time components need it
if (isBrowser) {
  ensureScrollTrigger()
}

export { gsap }
