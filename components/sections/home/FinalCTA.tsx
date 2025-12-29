'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'

// ============================================================================
// Main FinalCTA Section
// ============================================================================

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const pulseRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Pulse animation on hover
  useEffect(() => {
    if (!pulseRef.current || prefersReducedMotion()) return

    if (isHovered) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        repeat: -1,
      })
    } else {
      gsap.killTweensOf(pulseRef.current)
      gsap.to(pulseRef.current, {
        scale: 1,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [isHovered])

  // Reveal animation
  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    if (prefersReducedMotion()) {
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        gsap.fromTo(
          content,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: motionDuration(0.7),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }, section)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  // Magnetic button effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current || prefersReducedMotion()) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(buttonRef.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (!buttonRef.current) return

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    })
  }, [])

  return (
    <Section id="cta" className="overflow-hidden" variant="default">
      <section ref={sectionRef} className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 via-primary-900/15 to-neutral-950" />
        
        {/* Subtle radial glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-accent-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10">
          <div
            ref={contentRef}
            className="max-w-3xl mx-auto text-center opacity-0"
          >
            {/* Eyebrow */}
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/70 mb-6">
              Ready to get started?
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 word-spacing-wide text-balance">
              Let's build your next production line.
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-neutral-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              From discovery to deployment, we'll engineer a system that hits your
              targets for cycle time, quality, and uptime.
            </p>

            {/* CTA Button */}
            <div className="relative inline-block">
              {/* Pulse ring */}
              <div
                ref={pulseRef}
                className="absolute inset-0 rounded-lg bg-accent-500/30 opacity-0 pointer-events-none"
                aria-hidden="true"
              />

              <Link
                ref={buttonRef}
                href="/contact"
                className="relative inline-flex items-center justify-center px-10 py-5 text-base font-semibold tracking-wide text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-colors duration-300 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <span className="relative z-10">Start a Conversation</span>
                <svg
                  className="relative z-10 w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Trust signal */}
            <p className="mt-8 text-sm text-neutral-500">
              No commitment required. We'll scope your project and provide a detailed proposal.
            </p>
          </div>
        </div>
      </section>
    </Section>
  )
}

