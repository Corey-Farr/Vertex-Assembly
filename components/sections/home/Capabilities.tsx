'use client'

import { useEffect, useRef, useCallback } from 'react'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

// ============================================================================
// Capability Data
// ============================================================================

interface CapabilitySpec {
  label: string
  value: string
}

interface Capability {
  title: string
  description: string
  specs: CapabilitySpec[]
  icon: React.ReactNode
}

const capabilities: Capability[] = [
  {
    title: 'Cell Automation',
    description:
      'Compact robotic cells that fit into existing footprints, executing multi-step assembly with sub-millimeter repeatability.',
    specs: [
      { label: 'Cycle time', value: '<8s' },
      { label: 'Repeatability', value: '±0.02mm' },
      { label: 'Changeover', value: '<15min' },
    ],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="12" width="10" height="14" rx="1" />
        <rect x="18" y="6" width="10" height="20" rx="1" />
        <path d="M14 16h4" strokeLinecap="round" />
        <path d="M14 20h4" strokeLinecap="round" />
        <circle cx="9" cy="8" r="3" />
        <path d="M9 11v1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Vision QC',
    description:
      'AI-powered inspection stations that catch defects inline, reducing escapes and providing traceability for every unit.',
    specs: [
      { label: 'Latency', value: '<50ms' },
      { label: 'Accuracy', value: '99.8%' },
      { label: 'Defect types', value: '40+' },
    ],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="14" r="8" />
        <circle cx="16" cy="14" r="3" />
        <path d="M16 22v6" strokeLinecap="round" />
        <path d="M12 28h8" strokeLinecap="round" />
        <path d="M22 8l2-2" strokeLinecap="round" />
        <path d="M8 8l-2-2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Line Orchestration',
    description:
      'End-to-end coordination of conveyors, buffers, and stations—keeping production balanced and bottlenecks visible.',
    specs: [
      { label: 'Uptime', value: '>98%' },
      { label: 'Throughput', value: '+35%' },
      { label: 'OEE visibility', value: 'Real-time' },
    ],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16h6l3-6 4 12 3-6h8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="6" r="2" />
        <circle cx="16" cy="6" r="2" />
        <circle cx="26" cy="6" r="2" />
        <path d="M6 8v4M16 8v2M26 8v4" strokeLinecap="round" />
      </svg>
    ),
  },
]

// ============================================================================
// Capability Card Component
// ============================================================================

interface CapabilityCardProps {
  capability: Capability
  index: number
}

function CapabilityCard({ capability, index }: CapabilityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  // Hover effects
  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current || prefersReducedMotion()) return

    // Card lift
    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Border sweep highlight
    if (borderRef.current) {
      gsap.fromTo(
        borderRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.4, ease: 'power2.out' }
      )
    }

    // Icon micro-rotation
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 8,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || prefersReducedMotion()) return

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })

    if (borderRef.current) {
      gsap.to(borderRef.current, {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 0.3,
        ease: 'power2.in',
      })
    }

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <div
      ref={cardRef}
      data-capability-card
      data-index={index}
      className="capability-card relative rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 cursor-default overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        // Initial state for clip-path animation
        clipPath: 'inset(0 0 0 0)',
      }}
    >
      {/* Border highlight sweep */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-400 via-accent-500 to-primary-500 origin-left scale-x-0"
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        ref={iconRef}
        className="text-accent-400 mb-6 inline-block"
      >
        {capability.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3">
        {capability.title}
      </h3>

      {/* Description */}
      <p className="text-neutral-400 leading-relaxed mb-6">
        {capability.description}
      </p>

      {/* Specs row */}
      <div className="flex flex-wrap gap-4 pt-5 border-t border-neutral-800">
        {capability.specs.map((spec) => (
          <div key={spec.label} className="flex-1 min-w-[5rem]">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-1">
              {spec.label}
            </div>
            <div className="text-sm font-semibold text-accent-400 tabular-nums">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Main Capabilities Section
// ============================================================================

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const cardsContainer = cardsRef.current

    if (!section || !title) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        // =====================================================================
        // All animations triggered by a single ScrollTrigger on the section
        // This works better with parallax since the section enters earlier
        // =====================================================================
        const TITLE_STAGGER = 0.06
        const TITLE_DURATION = 0.65
        const CARD_STAGGER = 0.15
        const CARD_DURATION = 0.7
        const CARD_PARALLAX_Y = 40

        // Set initial states
        let titleElements: Element[] = []
        if (!isReduced) {
          const { elements, restore } = applySplitText(title, 'words', 'cap-title')
          splitRestore = restore
          titleElements = elements
          gsap.set(elements, { opacity: 0, y: 30, rotateX: -10 })
        }

        if (subtitle && !isReduced) {
          gsap.set(subtitle, { opacity: 0, y: 16 })
        }

        const cards = cardsContainer?.querySelectorAll('[data-capability-card]')
        if (cards && !isReduced) {
          gsap.set(cards, {
            opacity: 0,
            y: CARD_PARALLAX_Y,
            clipPath: 'inset(0 100% 0 0)',
          })
        }

        if (isReduced) {
          // Just show everything for reduced motion
          gsap.set(title, { opacity: 1 })
          if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 })
          if (cards) gsap.set(cards, { opacity: 1, clipPath: 'inset(0 0 0 0)' })
          return
        }

        // Single trigger for all animations - fires when section top hits bottom of viewport
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom', // As soon as section enters viewport
          once: true,
          onEnter: () => {
            // Title animation
            if (titleElements.length) {
              gsap.to(titleElements, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: TITLE_DURATION,
                stagger: TITLE_STAGGER,
                delay: 0.1,
                ease: 'power3.out',
              })
            }

            // Subtitle animation
            if (subtitle) {
              gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'power2.out',
              })
            }

            // Cards animation
            if (cards) {
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                clipPath: 'inset(0 0% 0 0)',
                duration: CARD_DURATION,
                stagger: CARD_STAGGER,
                delay: 0.4,
                ease: 'power3.out',
              })
            }
          },
        })
      }, section)
    }

    void setup()

    return () => {
      killed = true
      splitRestore?.()
      ctx?.revert()
    }
  }, [])

  return (
    <Section id="capabilities" className="bg-neutral-950">
      <section ref={sectionRef}>
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
              Core Capabilities
            </div>
            <h2
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white word-spacing-wide mb-5"
              style={{ perspective: '800px' }}
            >
              Built for precision at scale.
            </h2>
            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-neutral-400 leading-relaxed opacity-0"
            >
              Three integrated disciplines that turn complex production requirements into reliable,
              measurable automation systems.
            </p>
          </div>

          {/* Cards grid */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {capabilities.map((cap, idx) => (
              <CapabilityCard key={cap.title} capability={cap} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

