'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Section from '@/components/ui/Section'
import CursorPill from '@/components/ui/CursorPill'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'

// ============================================================================
// Case Study Data
// ============================================================================

interface CaseStudy {
  slug: string
  title: string
  description: string
  tags: string[]
  gradient: string
}

const caseStudies: CaseStudy[] = [
  {
    slug: 'automotive-assembly',
    title: 'Automotive Assembly Line',
    description:
      'High-throughput robotic cell transformation for a Tier-1 automotive supplier—reducing cycle time by 40% while improving first-pass yield.',
    tags: ['Robotics', 'Assembly', 'Automotive'],
    gradient: 'from-accent-600/50 via-accent-700/40 to-primary-800/50',
  },
  {
    slug: 'pharma-packaging',
    title: 'Pharmaceutical Packaging',
    description:
      'Sterile environment automation for high-volume blister packaging with 99.9% accuracy and full lot traceability.',
    tags: ['Packaging', 'Vision QC', 'Healthcare'],
    gradient: 'from-primary-600/50 via-primary-700/40 to-accent-800/50',
  },
  {
    slug: 'electronics-manufacturing',
    title: 'Electronics Manufacturing',
    description:
      'Precision pick-and-place system handling micro-components with sub-millimeter accuracy and real-time defect detection.',
    tags: ['SMT', 'Inspection', 'Electronics'],
    gradient: 'from-accent-500/50 via-primary-600/40 to-accent-900/50',
  },
]

// ============================================================================
// Work Tile Component
// ============================================================================

interface WorkTileProps {
  study: CaseStudy
  index: number
}

function WorkTile({ study, index }: WorkTileProps) {
  const tileRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Hover animations
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (prefersReducedMotion()) return

    // Image zoom
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    // Noise overlay fade in
    if (noiseRef.current) {
      gsap.to(noiseRef.current, {
        opacity: 0.15,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (prefersReducedMotion()) return

    // Image zoom reset
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    // Noise overlay fade out
    if (noiseRef.current) {
      gsap.to(noiseRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  return (
    <Link
      ref={tileRef}
      href={`/work/${study.slug}`}
      data-work-tile
      data-index={index}
      className="group relative block rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors duration-300 hover:border-neutral-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image placeholder */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <div
          ref={imageRef}
          className={`absolute inset-0 bg-gradient-to-br ${study.gradient} transition-transform will-change-transform`}
        >
          {/* Abstract pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${index}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
          </svg>

          {/* Diagonal lines */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`lines-${index}`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="1" className="text-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#lines-${index})`} />
            </svg>
          </div>
        </div>

        {/* Noise overlay */}
        <div
          ref={noiseRef}
          className="absolute inset-0 opacity-0 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-900/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-400/90 bg-accent-500/10 border border-accent-500/20 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors duration-300">
          {study.title}
        </h3>

        {/* Description */}
        <p className="text-neutral-400 leading-relaxed line-clamp-3 mb-4">
          {study.description}
        </p>

        {/* Link indicator (mobile) */}
        <div className="flex items-center gap-2 text-sm font-semibold text-accent-400 md:hidden">
          <span>View Case Study</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Cursor-follow pill (desktop only) */}
      <CursorPill
        label="View"
        containerRef={tileRef}
        isHovered={isHovered}
      />
    </Link>
  )
}

// ============================================================================
// Main FeaturedWork Section
// ============================================================================

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    const grid = gridRef.current

    if (!section) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        // =====================================================================
        // Header reveal
        // =====================================================================
        if (header) {
          if (isReduced) {
            gsap.set(header, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              header,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: motionDuration(0.6),
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: header,
                  start: 'top 85%',
                  once: true,
                },
              }
            )
          }
        }

        // =====================================================================
        // Tiles stagger reveal
        // Tweak: TILE_STAGGER, TILE_DURATION, TILE_Y_OFFSET
        // =====================================================================
        const TILE_STAGGER = 0.12
        const TILE_DURATION = 0.65
        const TILE_Y_OFFSET = 50

        if (grid) {
          const tiles = grid.querySelectorAll('[data-work-tile]')

          if (isReduced) {
            gsap.set(tiles, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              tiles,
              { opacity: 0, y: TILE_Y_OFFSET },
              {
                opacity: 1,
                y: 0,
                duration: TILE_DURATION,
                stagger: TILE_STAGGER,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: grid,
                  start: 'top 80%',
                  once: true,
                },
              }
            )
          }
        }
      }, section)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <Section id="featured-work" className="bg-neutral-900/20">
      <section ref={sectionRef}>
        <div className="container-custom">
          {/* Header */}
          <div ref={headerRef} className="mb-14 opacity-0">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
                  Featured Work
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white word-spacing-wide">
                  Real results, real factories.
                </h2>
              </div>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-accent-400 transition-colors group"
              >
                <span>View all projects</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <p className="mt-5 text-lg text-neutral-400 max-w-2xl">
              A selection of automation projects that delivered measurable improvements
              in cycle time, quality, and operational efficiency.
            </p>
          </div>

          {/* Tiles grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {caseStudies.map((study, idx) => (
              <WorkTile key={study.slug} study={study} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

