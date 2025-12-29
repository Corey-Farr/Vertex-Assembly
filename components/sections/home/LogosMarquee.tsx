'use client'

import { useEffect, useRef, useState } from 'react'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'

// ============================================================================
// Client Logos Data
// ============================================================================

const clients = [
  'Orion Motors',
  'Nova Pharma',
  'Kinetix Robotics',
  'Helio Systems',
  'Atlas Packaging',
  'Pulse Electronics',
  'Forge Industries',
  'Meridian Automotive',
]

// ============================================================================
// Logo Item Component
// ============================================================================

function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 px-8 py-4 mx-3 rounded-lg border border-neutral-800/50 bg-neutral-900/30 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700/50 transition-colors">
      <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

// ============================================================================
// Main LogosMarquee Section
// ============================================================================

export default function LogosMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const isReduced = prefersReducedMotion()

  // Pause on hover
  useEffect(() => {
    if (!trackRef.current || isReduced) return

    if (isPaused) {
      trackRef.current.style.animationPlayState = 'paused'
    } else {
      trackRef.current.style.animationPlayState = 'running'
    }
  }, [isPaused, isReduced])

  // Reveal animation
  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    const marquee = marqueeRef.current

    if (!section) return

    if (isReduced) {
      if (header) gsap.set(header, { opacity: 1, y: 0 })
      if (marquee) gsap.set(marquee, { opacity: 1, y: 0 })
      return
    }

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: motionDuration(0.5),
              ease: 'power2.out',
              scrollTrigger: {
                trigger: header,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }

        if (marquee) {
          gsap.fromTo(
            marquee,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: motionDuration(0.45),
              delay: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: marquee,
                start: 'top 90%',
                once: true,
              },
            }
          )
        }
      }, section)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [isReduced])

  // Double the logos for seamless loop
  const repeatedLogos = [...clients, ...clients]

  return (
    <Section id="clients" className="overflow-hidden">
      <section ref={sectionRef}>
        {/* Header */}
        <div className="container-custom mb-10">
          <div ref={headerRef} className="text-center opacity-0">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-3">
              Trusted by industry leaders
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-300">
              Partnering with teams that build at scale
            </h2>
          </div>
        </div>

        {/* Marquee */}
        <div
          ref={marqueeRef}
          className="relative opacity-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

          {/* Track */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className={`
                flex w-max
                ${isReduced ? 'flex-wrap justify-center gap-3 px-4' : 'marquee-track'}
              `}
              style={isReduced ? {} : { animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {repeatedLogos.map((name, idx) => (
                <LogoItem key={`${name}-${idx}`} name={name} />
              ))}
            </div>
          </div>
        </div>

        {/* Marquee CSS animation */}
        <style jsx global>{`
          @keyframes marquee-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .marquee-track {
            animation: marquee-scroll 30s linear infinite;
            will-change: transform;
          }

          @media (max-width: 768px) {
            .marquee-track {
              animation-duration: 22s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none !important;
              transform: none !important;
            }
          }
        `}</style>
      </section>
    </Section>
  )
}

