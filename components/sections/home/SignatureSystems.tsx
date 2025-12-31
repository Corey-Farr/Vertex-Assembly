'use client'

import { useEffect, useRef } from 'react'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'

// ============================================================================
// System Data
// ============================================================================

type SpecType = 'performance' | 'operational' | 'config' | 'reliability'

interface SystemSpec {
  label: string
  value: number
  suffix: string
  type: SpecType
}

// Color classes for each spec type (matches the legend)
const specColors: Record<SpecType, { number: string; suffix: string }> = {
  performance: { number: 'text-accent-400', suffix: 'text-accent-400/70' },
  operational: { number: 'text-primary-400', suffix: 'text-primary-400/70' },
  config: { number: 'text-neutral-400', suffix: 'text-neutral-400/70' },
  reliability: { number: 'text-green-400', suffix: 'text-green-400/70' },
}

interface System {
  name: string
  tagline: string
  description: string
  specs: SystemSpec[]
  gradient: string // Tailwind gradient classes for image placeholder
}

const systems: System[] = [
  {
    name: 'Atlas Cell',
    tagline: 'Compact Assembly',
    description:
      'A self-contained robotic assembly cell that fits in tight footprints while delivering high-mix flexibility.',
    specs: [
      { label: 'Cycle', value: 6, suffix: 's', type: 'performance' },
      { label: 'Axes', value: 6, suffix: '', type: 'config' },
      { label: 'Payload', value: 12, suffix: 'kg', type: 'operational' },
    ],
    gradient: 'from-accent-600/40 via-accent-700/30 to-primary-800/40',
  },
  {
    name: 'Pulse Inspection',
    tagline: 'Vision QC Station',
    description:
      'Multi-camera inspection platform with edge inference, catching defects in-line before they propagate.',
    specs: [
      { label: 'Latency', value: 35, suffix: 'ms', type: 'performance' },
      { label: 'Cameras', value: 8, suffix: '', type: 'config' },
      { label: 'Accuracy', value: 99.8, suffix: '%', type: 'reliability' },
    ],
    gradient: 'from-primary-600/40 via-primary-700/30 to-accent-800/40',
  },
  {
    name: 'RailSync Conveyance',
    tagline: 'Line Orchestration',
    description:
      'Intelligent conveyor segments with built-in buffering and automatic re-routing to minimize idle time.',
    specs: [
      { label: 'Speed', value: 45, suffix: 'm/min', type: 'performance' },
      { label: 'Zones', value: 24, suffix: '', type: 'config' },
      { label: 'Uptime', value: 99.2, suffix: '%', type: 'reliability' },
    ],
    gradient: 'from-accent-500/40 via-primary-600/30 to-accent-800/40',
  },
  {
    name: 'Forge Palletizing',
    tagline: 'End-of-Line',
    description:
      'High-speed palletizing with mixed-SKU pattern optimization and integrated stretch-wrap sequencing.',
    specs: [
      { label: 'Rate', value: 28, suffix: 'cpm', type: 'performance' },
      { label: 'Reach', value: 3.2, suffix: 'm', type: 'operational' },
      { label: 'Layers', value: 12, suffix: '', type: 'config' },
    ],
    gradient: 'from-primary-500/40 via-accent-600/30 to-primary-800/40',
  },
]

// ============================================================================
// System Card Component
// ============================================================================

interface SystemCardProps {
  system: System
  index: number
}

function SystemCard({ system, index }: SystemCardProps) {
  return (
    <div
      data-system-card
      data-index={index}
      className="system-card relative flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[28rem] lg:w-[32rem] rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden"
    >
      {/* Image placeholder with gradient */}
      <div
        data-card-image
        className={`relative h-48 md:h-56 bg-gradient-to-br ${system.gradient} overflow-hidden`}
      >
        {/* Abstract grid pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`grid-${index}`} width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${index})`} className="text-white" />
          </svg>
        </div>
        {/* Tagline badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 bg-black/30 backdrop-blur-sm rounded-full">
            {system.tagline}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-white mb-3">{system.name}</h3>
        <p className="text-neutral-400 leading-relaxed mb-6 line-clamp-3">
          {system.description}
        </p>

        {/* Specs row with count-up numbers */}
        <div className="flex gap-6 pt-5 border-t border-neutral-800">
          {system.specs.map((spec, specIdx) => {
            const colors = specColors[spec.type]
            return (
              <div key={spec.label} className="flex-1">
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-1">
                  {spec.label}
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span
                    data-spec-number
                    data-value={spec.value}
                    data-suffix={spec.suffix}
                    data-card-index={index}
                    data-spec-index={specIdx}
                    className={`text-lg font-bold tabular-nums ${colors.number}`}
                  >
                    0
                  </span>
                  <span className={`text-sm ${colors.suffix}`}>{spec.suffix}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Spec Legend Component
// ============================================================================

function SpecLegend() {
  return (
    <div className="mt-10 pt-6 border-t border-neutral-800">
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-4">
        Spec Legend
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-400" />
          <span>Performance metrics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-400" />
          <span>Operational limits</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-500" />
          <span>Configuration options</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Reliability targets</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main SignatureSystems Section
// ============================================================================

export default function SignatureSystems() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const mobileStackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    const track = trackRef.current
    const mobileStack = mobileStackRef.current

    if (!section || !container || !track) return

    let ctx: gsap.Context | null = null
    let mm: gsap.MatchMedia | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        mm = gsap.matchMedia()

        // =====================================================================
        // Desktop: Pinned horizontal scroll
        // Tweak: PIN_DURATION_MULTIPLIER controls how long the pin lasts
        // =====================================================================
        mm.add('(min-width: 768px)', () => {
          if (isReduced) {
            // Still show cards, just no animation
            gsap.set(track, { x: 0 })
            return
          }

          // Calculate scroll distance
          const getScrollDistance = () => {
            const trackWidth = track.scrollWidth
            const containerWidth = container.clientWidth
            // Account for left column width
            const leftColWidth = leftColRef.current?.clientWidth || 0
            const availableWidth = containerWidth - leftColWidth - 48 // 48px for gap
            return Math.max(0, trackWidth - availableWidth)
          }

          // Pin and scrub horizontal movement
          const PIN_DURATION_MULTIPLIER = 1.1 // Adjust for faster/slower scroll

          gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: () => `+=${getScrollDistance() * PIN_DURATION_MULTIPLIER}`,
              pin: true,
              // More robust when any ancestor has transforms (e.g., route transitions)
              pinType: 'transform',
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Trigger count-up when card reaches center or is visible on screen
                const cards = track.querySelectorAll('[data-system-card]')
                const centerX = window.innerWidth / 2
                const viewportRight = window.innerWidth

                cards.forEach((card) => {
                  const cardRect = card.getBoundingClientRect()
                  const cardCenter = cardRect.left + cardRect.width / 2
                  const distanceFromCenter = Math.abs(cardCenter - centerX)

                  // Trigger count-up if:
                  // 1. Card is near center (within 200px), OR
                  // 2. Card is visible and scroll is > 80% complete (for last cards)
                  const isNearCenter = distanceFromCenter < 200
                  const isVisibleAndNearEnd = self.progress > 0.8 && cardRect.left < viewportRight && cardRect.right > 0

                  if (isNearCenter || isVisibleAndNearEnd) {
                    const specNumbers = card.querySelectorAll('[data-spec-number]')
                    specNumbers.forEach((numEl) => {
                      const el = numEl as HTMLElement
                      if (el.dataset.counted) return
                      el.dataset.counted = 'true'

                      const endValue = parseFloat(el.dataset.value || '0')
                      const isDecimal = endValue % 1 !== 0

                      gsap.to(
                        { val: 0 },
                        {
                          val: endValue,
                          duration: 0.8,
                          ease: 'power2.out',
                          onUpdate: function () {
                            const current = this.targets()[0].val
                            el.textContent = isDecimal
                              ? current.toFixed(1)
                              : Math.round(current).toString()
                          },
                        }
                      )
                    })
                  }
                })
              },
            },
          })

          // Image reveal animation for each card
          const cardImages = track.querySelectorAll('[data-card-image]')
          cardImages.forEach((img, idx) => {
            gsap.fromTo(
              img,
              { clipPath: 'inset(0 100% 0 0)' },
              {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.8,
                delay: idx * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: container,
                  start: 'top 80%',
                  once: true,
                },
              }
            )
          })
        })

        // =====================================================================
        // Mobile: Vertical stack with simple reveals
        // =====================================================================
        mm.add('(max-width: 767px)', () => {
          if (!mobileStack) return

          const cards = mobileStack.querySelectorAll('[data-system-card]')

          if (isReduced) {
            gsap.set(cards, { opacity: 1, y: 0 })
            // Set final values for specs
            cards.forEach((card) => {
              const specNumbers = card.querySelectorAll('[data-spec-number]')
              specNumbers.forEach((numEl) => {
                const el = numEl as HTMLElement
                el.textContent = el.dataset.value || '0'
              })
            })
            return
          }

          cards.forEach((card, idx) => {
            // Reveal animation
            gsap.fromTo(
              card,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: motionDuration(0.6),
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  once: true,
                  onEnter: () => {
                    // Count-up specs when card enters
                    const specNumbers = card.querySelectorAll('[data-spec-number]')
                    specNumbers.forEach((numEl) => {
                      const el = numEl as HTMLElement
                      if (el.dataset.counted) return
                      el.dataset.counted = 'true'

                      const endValue = parseFloat(el.dataset.value || '0')
                      const isDecimal = endValue % 1 !== 0

                      gsap.to(
                        { val: 0 },
                        {
                          val: endValue,
                          duration: 0.8,
                          delay: 0.2,
                          ease: 'power2.out',
                          onUpdate: function () {
                            const current = this.targets()[0].val
                            el.textContent = isDecimal
                              ? current.toFixed(1)
                              : Math.round(current).toString()
                          },
                        }
                      )
                    })
                  },
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

  return (
    <Section id="signature-systems" className="bg-neutral-900/30 overflow-hidden">
      <section ref={sectionRef}>
        {/* Desktop Layout: pinned with horizontal scroll */}
        <div
          ref={containerRef}
          className="hidden md:flex container-custom gap-12 lg:gap-16 min-h-screen items-center relative z-10"
        >
          {/* Left column - sticky content */}
          <div
            ref={leftColRef}
            className="flex-shrink-0 w-72 lg:w-80"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
              Signature Systems
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 word-spacing-wide">
              Modular platforms, production-ready.
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              A portfolio of proven automation building blocks. Each system is
              engineered for rapid deployment, consistent performance, and
              seamless integration with your existing infrastructure.
            </p>
            <SpecLegend />
          </div>

          {/* Right: Horizontal scroll track */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-6 lg:gap-8 w-max will-change-transform py-4"
            >
              {systems.map((system, idx) => (
                <SystemCard key={system.name} system={system} index={idx} />
              ))}
              {/* Spacer at end */}
              <div className="w-8 flex-shrink-0" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Vertical stack */}
        <div
          ref={mobileStackRef}
          className="md:hidden container-custom"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
              Signature Systems
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 word-spacing-wide">
              Modular platforms, production-ready.
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              A portfolio of proven automation building blocks engineered for
              rapid deployment and consistent performance.
            </p>
          </div>

          {/* Stacked cards */}
          <div className="space-y-6">
            {systems.map((system, idx) => (
              <SystemCard key={system.name} system={system} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

