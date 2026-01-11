'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

// ============================================================================
// Data
// ============================================================================

const principles = [
  {
    id: 'precision',
    title: 'Precision First',
    description:
      'Every system we engineer is built to tolerances measured in microns. We obsess over the details because in manufacturing, precision is the difference between success and scrap.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/30" />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <circle cx="24" cy="24" r="4" fill="currentColor" className="text-accent-400" />
        <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <line x1="24" y1="36" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <line x1="4" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <line x1="36" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
      </svg>
    ),
  },
  {
    id: 'partnership',
    title: 'True Partnership',
    description:
      'We embed with your team, learn your constraints, and co-develop solutions. Our success is measured by your production metrics, not our billable hours.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path
          d="M12 28C12 28 16 24 24 24C32 24 36 28 36 28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400/50"
        />
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <circle cx="32" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" className="text-accent-400/50" />
        <path
          d="M16 38L24 32L32 38"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-400"
        />
        <circle cx="24" cy="32" r="3" fill="currentColor" className="text-accent-400" />
      </svg>
    ),
  },
  {
    id: 'innovation',
    title: 'Relentless Innovation',
    description:
      'We stay ahead of the curve—adopting new technologies, refining methodologies, and pushing the boundaries of what automation can achieve.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
        <path
          d="M24 6L24 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400"
        />
        <path
          d="M24 34L24 42"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400/50"
        />
        <path
          d="M6 24L14 24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400/50"
        />
        <path
          d="M34 24L42 24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-accent-400/50"
        />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" className="text-accent-400" />
        <path
          d="M24 20V24L27 27"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-400"
        />
        <circle cx="11" cy="11" r="2" fill="currentColor" className="text-accent-400/30" />
        <circle cx="37" cy="11" r="2" fill="currentColor" className="text-accent-400/30" />
        <circle cx="11" cy="37" r="2" fill="currentColor" className="text-accent-400/30" />
        <circle cx="37" cy="37" r="2" fill="currentColor" className="text-accent-400/30" />
      </svg>
    ),
  },
]

const timeline = [
  {
    year: '2009',
    title: 'Founded in Detroit',
    description:
      'Three engineers from the automotive industry launch Vertex Assembly with a vision to bring precision robotics to mid-market manufacturers.',
    highlight: 'First client: Tier-2 automotive supplier',
  },
  {
    year: '2012',
    title: 'First Major Deployment',
    description:
      'Completed our first fully automated assembly cell, achieving 99.4% uptime in year one. Word spreads—referrals become our primary growth engine.',
    highlight: '50+ systems deployed',
  },
  {
    year: '2016',
    title: 'International Expansion',
    description:
      'Opened engineering centers in Germany and Japan to serve global OEMs. Developed proprietary simulation software for offline programming.',
    highlight: 'Presence in 12 countries',
  },
  {
    year: '2019',
    title: 'Industry 4.0 Pioneer',
    description:
      'Launched our connected factory platform, integrating IoT sensors, predictive analytics, and remote monitoring across client installations.',
    highlight: '200+ connected systems',
  },
  {
    year: '2023',
    title: 'AI-Powered Optimization',
    description:
      'Introduced machine learning models for real-time process optimization, reducing defect rates by an average of 34% across deployments.',
    highlight: '500+ systems worldwide',
  },
]

const team = [
  {
    role: 'Engineering',
    count: 45,
    description: 'Controls, mechanical, and software engineers',
  },
  {
    role: 'Integration',
    count: 28,
    description: 'Field technicians and project managers',
  },
  {
    role: 'Innovation',
    count: 12,
    description: 'R&D and emerging technology specialists',
  },
]

// ============================================================================
// Abstract Portrait Component
// ============================================================================

function AbstractPortrait({ seed, role }: { seed: number; role: string }) {
  // Generate pseudo-random values based on seed for consistent abstract shapes
  const hue = (seed * 137.5) % 360
  const shapes = []

  for (let i = 0; i < 5; i++) {
    const x = 20 + ((seed * (i + 1) * 17) % 60)
    const y = 15 + ((seed * (i + 2) * 23) % 50)
    const size = 8 + ((seed * (i + 3) * 11) % 20)
    const opacity = 0.1 + ((seed * (i + 4) * 7) % 30) / 100

    shapes.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={size}
        fill={`hsla(${hue + i * 20}, 60%, 60%, ${opacity})`}
        className="mix-blend-screen"
      />
    )
  }

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsla(${hue}, 40%, 15%, 1)`} />
          <stop offset="100%" stopColor={`hsla(${hue + 30}, 30%, 10%, 1)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="80" fill={`url(#grad-${seed})`} />
      {shapes}
      {/* Abstract geometric accent */}
      <path
        d={`M${30 + (seed % 20)} ${60 + (seed % 10)} L${50 + (seed % 15)} ${20 + (seed % 15)} L${70 + (seed % 10)} ${55 + (seed % 12)} Z`}
        fill="none"
        stroke={`hsla(${hue}, 70%, 60%, 0.3)`}
        strokeWidth="0.5"
      />
    </svg>
  )
}

// ============================================================================
// Timeline Year Indicator
// ============================================================================

interface YearIndicatorProps {
  year: string
  isActive: boolean
  index: number
}

function YearIndicator({ year, isActive, index }: YearIndicatorProps) {
  return (
    <div
      data-year-indicator
      data-index={index}
      className={`
        flex items-center gap-4 py-5 cursor-pointer transition-all duration-500
        ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-50'}
      `}
    >
      {/* Year dot */}
      <div
        className={`
          relative w-4 h-4 rounded-full transition-all duration-500
          ${isActive ? 'bg-accent-400 scale-125' : 'bg-neutral-700'}
        `}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-accent-400 animate-ping opacity-30" />
        )}
      </div>

      {/* Year text */}
      <span
        className={`
          text-2xl font-bold tracking-tight transition-all duration-500
          ${isActive ? 'text-accent-400' : 'text-neutral-600'}
        `}
      >
        {year}
      </span>
    </div>
  )
}

// ============================================================================
// Main About Page
// ============================================================================

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)
  const timelineSectionRef = useRef<HTMLElement>(null)
  const timelinePinRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const contentPanelsRef = useRef<HTMLDivElement>(null)
  const mobileTimelineRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLElement>(null)

  const [activeYear, setActiveYear] = useState(0)

  // Hero animations
  useEffect(() => {
    const hero = heroRef.current
    const headline = headlineRef.current
    const mission = missionRef.current

    if (!hero || !headline) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      await ensureScrollTrigger()
      if (killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        if (!isReduced) {
          // Split headline animation
          const { elements, restore } = applySplitText(headline, 'words', 'about-hero')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 60, rotateX: -25 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.07,
            delay: 0.15,
            ease: 'power3.out',
          })
        }

        // Mission text reveal
        if (mission) {
          if (isReduced) {
            gsap.set(mission, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              mission,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.6,
                ease: 'power2.out',
              }
            )
          }
        }
      }, hero)
    }

    void setup()

    return () => {
      killed = true
      splitRestore?.()
      ctx?.revert()
    }
  }, [])

  // Principles cards reveal
  useEffect(() => {
    const principles = principlesRef.current
    if (!principles) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const cards = principles.querySelectorAll('.principle-card')

      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0, rotateY: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, rotateY: -10 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: principles,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }, principles)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  // Timeline pinned scroll animation
  useEffect(() => {
    const section = timelineSectionRef.current
    const pinContainer = timelinePinRef.current
    const progressLine = progressLineRef.current
    const panels = contentPanelsRef.current

    if (!section || !pinContainer || !progressLine || !panels) return

    let ctx: gsap.Context | null = null
    let mm: gsap.MatchMedia | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()
        mm = gsap.matchMedia()

        // Desktop: Pinned timeline
        mm.add('(min-width: 768px)', () => {
          const PIN_DISTANCE = 2500
          const contentItems = panels.querySelectorAll('[data-timeline-content]')

          if (isReduced) {
            // Static fallback: show all content
            gsap.set(progressLine, { scaleY: 1 })
            gsap.set(contentItems, { opacity: 1, y: 0 })
            return
          }

          // Initial states
          gsap.set(progressLine, { scaleY: 0, transformOrigin: 'top' })
          gsap.set(contentItems, { opacity: 0, y: 30 })
          gsap.set(contentItems[0], { opacity: 1, y: 0 })

          // Main timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinContainer,
              start: 'top top',
              end: `+=${PIN_DISTANCE}`,
              pin: true,
              pinType: 'transform',
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const progress = self.progress
                const yearIndex = Math.min(
                  timeline.length - 1,
                  Math.floor(progress * timeline.length)
                )
                setActiveYear(yearIndex)
              },
            },
          })

          // Progress line animation
          tl.to(progressLine, { scaleY: 1, ease: 'none', duration: 1 }, 0)

          // Content panel transitions
          timeline.forEach((_, idx) => {
            if (idx === 0) return

            const startAt = idx / timeline.length
            const prevItem = contentItems[idx - 1]
            const currentItem = contentItems[idx]

            tl.to(prevItem, { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in' }, startAt - 0.04)
            tl.to(currentItem, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, startAt)
          })
        })

        // Mobile: Simple scroll reveals
        mm.add('(max-width: 767px)', () => {
          if (!mobileTimelineRef.current) return

          const mobileItems = mobileTimelineRef.current.querySelectorAll('[data-mobile-timeline]')

          if (isReduced) {
            gsap.set(mobileItems, { opacity: 1, y: 0 })
            return
          }

          mobileItems.forEach((item) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 85%',
                  once: true,
                },
              }
            )
          })
        })
      }, section)
    }

    void setup()

    return () => {
      killed = true
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  // Team section reveal
  useEffect(() => {
    const teamSection = teamRef.current
    if (!teamSection) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const header = teamSection.querySelector('.team-header')
      const cards = teamSection.querySelectorAll('.team-card')

      if (prefersReducedMotion()) {
        gsap.set([header, ...Array.from(cards)], { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        // Header reveal
        gsap.fromTo(
          header,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: teamSection,
              start: 'top 80%',
              once: true,
            },
          }
        )

        // Cards stagger reveal
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cards[0],
              start: 'top 85%',
              once: true,
            },
          }
        )
      }, teamSection)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <div className="pt-20">
      {/* ================================================================== */}
      {/* Hero + Mission Section */}
      {/* ================================================================== */}
      <section ref={heroRef} className="section relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 right-1/4 w-[50rem] h-[50rem] bg-accent-500/10 rounded-full blur-[150px]" />
          <div className="absolute -bottom-32 left-1/4 w-[40rem] h-[40rem] bg-primary-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              About Vertex Assembly
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10 word-spacing-wide leading-[1.1]"
              style={{ perspective: '1000px' }}
            >
              We engineer the systems that power modern manufacturing.
            </h1>

            {/* Mission statement */}
            <div ref={missionRef} className="max-w-3xl opacity-0">
              <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-8">
                Since 2009, we&apos;ve been designing and deploying precision automation systems for manufacturers who refuse to compromise on quality, uptime, or throughput.
              </p>
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <div className="text-3xl font-bold text-accent-400 mb-1">500+</div>
                  <div className="text-neutral-500 uppercase tracking-wider">Systems Deployed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-400 mb-1">40+</div>
                  <div className="text-neutral-500 uppercase tracking-wider">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-400 mb-1">99.7%</div>
                  <div className="text-neutral-500 uppercase tracking-wider">Avg. Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Principles Section */}
      {/* ================================================================== */}
      <section className="section bg-neutral-900/40">
        <div className="container-custom">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-4">
              Our Principles
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              What drives us forward.
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              These aren&apos;t just values on a wall—they&apos;re the standards we hold ourselves to on every project.
            </p>
          </div>

          {/* Principles grid */}
          <div
            ref={principlesRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            style={{ perspective: '1000px' }}
          >
            {principles.map((principle) => (
              <div
                key={principle.id}
                className="principle-card group relative p-8 lg:p-10 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm hover:border-accent-500/30 hover:bg-neutral-900/80 transition-all duration-500"
                style={{ opacity: 0, transform: 'translateY(50px) rotateY(-10deg)' }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-6 text-accent-400">
                  {principle.icon}
                </div>

                {/* Content */}
                <h3 className="relative text-xl lg:text-2xl font-bold text-white mb-4">
                  {principle.title}
                </h3>
                <p className="relative text-neutral-400 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Timeline Section */}
      {/* ================================================================== */}
      <section ref={timelineSectionRef} className="overflow-hidden">
        {/* Desktop: Pinned Timeline */}
        <div
          ref={timelinePinRef}
          className="hidden md:flex flex-col justify-center min-h-screen relative z-10 bg-neutral-950"
        >
          <div className="container-custom py-20">
            {/* Section header */}
            <div className="mb-16">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-4">
                Our Journey
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 word-spacing-wide">
                15 years of building the future.
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl">
                From a small team with big ambitions to a global automation partner.
              </p>
            </div>

            {/* Timeline content */}
            <div className="grid grid-cols-12 gap-8 lg:gap-16">
              {/* Left: Year indicators */}
              <div className="col-span-3 lg:col-span-2">
                <div className="relative">
                  {/* Progress line background */}
                  <div className="absolute left-[7px] top-7 bottom-7 w-0.5 bg-neutral-800" />

                  {/* Progress line fill */}
                  <div
                    ref={progressLineRef}
                    className="absolute left-[7px] top-7 bottom-7 w-0.5 bg-accent-400 origin-top"
                    style={{ transform: 'scaleY(0)' }}
                  />

                  {/* Year indicators */}
                  <div className="relative">
                    {timeline.map((item, idx) => (
                      <YearIndicator
                        key={item.year}
                        year={item.year}
                        isActive={idx === activeYear}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Content panels */}
              <div className="col-span-9 lg:col-span-10">
                <div ref={contentPanelsRef} className="relative min-h-[350px]">
                  {timeline.map((item, idx) => (
                    <div
                      key={item.year}
                      data-timeline-content
                      data-index={idx}
                      className={idx === 0 ? '' : 'absolute inset-0'}
                      style={{ opacity: idx === 0 ? 1 : 0 }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Text content */}
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            {item.title}
                          </h3>
                          <p className="text-neutral-300 leading-relaxed text-lg mb-6">
                            {item.description}
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20">
                            <div className="w-2 h-2 rounded-full bg-accent-400" />
                            <span className="text-sm text-accent-400 font-medium">
                              {item.highlight}
                            </span>
                          </div>
                        </div>

                        {/* Visual placeholder */}
                        <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
                          <AbstractPortrait seed={idx * 17 + 42} role={item.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-5xl lg:text-6xl font-bold text-white/10">
                              {item.year}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked Timeline */}
        <div ref={mobileTimelineRef} className="md:hidden section">
          <div className="container-custom">
            {/* Header */}
            <div className="mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-4">
                Our Journey
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                15 years of building the future.
              </h2>
              <p className="text-neutral-400">
                From a small team with big ambitions to a global automation partner.
              </p>
            </div>

            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  data-mobile-timeline
                  className="relative pl-8 border-l-2 border-accent-400/30"
                >
                  {/* Year dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent-400" />

                  {/* Year */}
                  <div className="text-2xl font-bold text-accent-400 mb-2">{item.year}</div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>

                  {/* Description */}
                  <p className="text-neutral-400 leading-relaxed mb-4">{item.description}</p>

                  {/* Highlight */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    <span className="text-xs text-accent-400 font-medium">{item.highlight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Team / Culture Section */}
      {/* ================================================================== */}
      <section ref={teamRef} className="section bg-neutral-900/40">
        <div className="container-custom">
          {/* Header */}
          <div className="team-header text-center mb-16 opacity-0">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-4">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Engineers at heart.
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              A diverse team united by a passion for precision and a commitment to solving hard problems.
            </p>
          </div>

          {/* Team composition cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {team.map((group, idx) => (
              <div
                key={group.role}
                className="team-card group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60"
                style={{ opacity: 0 }}
              >
                {/* Abstract portrait background */}
                <div className="h-48 relative">
                  <AbstractPortrait seed={idx * 31 + 7} role={group.role} />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 -mt-12 relative z-10">
                  <div className="text-5xl font-bold text-accent-400 mb-2">{group.count}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{group.role}</h3>
                  <p className="text-neutral-500 text-sm">{group.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Culture statement */}
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl text-neutral-300 leading-relaxed mb-8 font-light italic">
              &ldquo;We don&apos;t just build systems—we build relationships. Every project is a partnership, and every client becomes part of the Vertex family.&rdquo;
            </blockquote>
            <div className="text-neutral-500">
              <span className="text-white font-medium">Marcus Chen</span>
              <span className="mx-2">·</span>
              <span>Co-founder & CEO</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA Section */}
      {/* ================================================================== */}
      <section className="section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 via-primary-900/15 to-neutral-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-accent-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              Join Our Story
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 word-spacing-wide text-balance">
              Ready to work with us?
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed">
              Whether you&apos;re planning your first automation project or scaling existing systems, we&apos;d love to hear about your goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wide text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-colors duration-300 group"
              >
                <span>Get in Touch</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wide text-neutral-200 border border-neutral-600 rounded-lg hover:border-neutral-400 hover:text-white transition-colors duration-300"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
