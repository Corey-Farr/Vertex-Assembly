'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, ensureScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import Hero from './Hero'
import Capabilities from './Capabilities'

// Use useLayoutEffect on client, useEffect on server (for SSR safety)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Wrapper component that creates a parallax scrolling effect where
 * the Capabilities section scrolls faster and appears to slide over the Hero.
 * 
 * Based on the "pinned-with-overlap" pattern:
 * - Hero section is pinned with pinSpacing: false
 * - Hero darkens as you scroll (to ~20% brightness)
 * - Capabilities moves faster (yPercent from 50 to 0)
 */
export default function HeroCapabilitiesParallax() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroOverlayRef = useRef<HTMLDivElement>(null)
  const capabilitiesRef = useRef<HTMLDivElement>(null)

  // Set initial state immediately to prevent flash/stutter
  useIsomorphicLayoutEffect(() => {
    const capabilities = capabilitiesRef.current
    const overlay = heroOverlayRef.current
    if (prefersReducedMotion()) return

    // Set initial positions immediately
    if (capabilities) {
      gsap.set(capabilities, { yPercent: 50 })
    }
    if (overlay) {
      gsap.set(overlay, { opacity: 0 })
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    const hero = heroRef.current
    const overlay = heroOverlayRef.current
    const capabilities = capabilitiesRef.current

    if (!wrap || !hero || !capabilities) return

    // Skip animations for reduced motion
    if (prefersReducedMotion()) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        // Pin the Hero section for a "layered" feel
        // pinSpacing: false is key - it allows the next section to overlap
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: '+=100%', // Pin for one viewport height of scroll
          pin: hero,
          pinSpacing: false,
        })

        // Darken the hero as you scroll (0 to 0.8 opacity = ~20% brightness)
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.8,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: '+=100%',
              scrub: true,
            },
          })
        }

        // Make Capabilities section move faster (comes from below and overtakes)
        gsap.to(capabilities, {
          yPercent: 0, // Ends at normal position
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: '+=100%',
            scrub: true,
          },
        })
      }, wrap)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      {/* Hero section (pinned underneath) */}
      <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>
        <Hero />
        {/* Dark overlay that fades in as you scroll - z-20 to be above all hero content */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 bg-neutral-950 pointer-events-none z-20"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </div>

      {/* Capabilities section (scrolls faster, appears on top) */}
      {/* bg-neutral-950 ensures no gap shows the hero underneath */}
      <div ref={capabilitiesRef} style={{ zIndex: 2 }} className="relative min-h-screen bg-neutral-950">
        <Capabilities />
      </div>
    </div>
  )
}
