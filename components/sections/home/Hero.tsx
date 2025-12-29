'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

// ============================================================================
// Dynamic import for WebGL scene (SSR-safe)
// ============================================================================

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
})

// ============================================================================
// Static SVG Fallback for reduced motion / WebGL unavailable
// ============================================================================

function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        viewBox="0 0 200 200"
        className="w-[60vmin] h-[60vmin] max-w-[500px] max-h-[500px] opacity-20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent-400"
        />
        {/* Inner rings */}
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent-400/60"
          transform="rotate(15 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="50"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary-400/50"
          transform="rotate(-30 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="30"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-accent-400/40"
          transform="rotate(45 100 100)"
        />
        {/* Center dot */}
        <circle cx="100" cy="100" r="8" className="fill-accent-400/80" />
      </svg>
    </div>
  )
}

// ============================================================================
// Magnetic CTA Button
// ============================================================================

interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

function MagneticButton({ href, children, variant = 'primary' }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!buttonRef.current || prefersReducedMotion()) return

      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      // Tweak: magnetic pull strength
      const MAGNETIC_STRENGTH = 0.3

      gsap.to(buttonRef.current, {
        x: x * MAGNETIC_STRENGTH,
        y: y * MAGNETIC_STRENGTH,
        duration: 0.3,
        ease: 'power2.out',
      })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return
    setIsHovered(false)
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    })
  }, [])

  const baseClasses =
    'hero-cta relative inline-flex items-center justify-center px-7 py-4 text-sm font-semibold tracking-wide transition-colors overflow-hidden group'

  const variantClasses =
    variant === 'primary'
      ? 'bg-accent-500 text-white hover:bg-accent-400'
      : 'border border-neutral-600 text-neutral-200 hover:border-neutral-400 hover:text-white bg-transparent'

  return (
    <Link
      ref={buttonRef}
      href={href}
      className={`${baseClasses} ${variantClasses}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <span className="relative z-10">{children}</span>
      {/* Underline sweep effect */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-white/30 transition-transform duration-300 ease-out ${
          isHovered ? 'w-full scale-x-100' : 'w-full scale-x-0'
        } origin-left`}
      />
    </Link>
  )
}

// ============================================================================
// Main Hero Component
// ============================================================================

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [showScene, setShowScene] = useState(false)

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebGLSupported(!!gl)
    } catch {
      setWebGLSupported(false)
    }

    // Delay scene mount slightly for smoother initial load
    const timer = setTimeout(() => setShowScene(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Mouse tracking for parallax
  useEffect(() => {
    if (prefersReducedMotion()) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // GSAP Animations
  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const headline = headlineRef.current
    const subhead = subheadRef.current
    const cta = ctaRef.current
    const sceneContainer = sceneContainerRef.current

    if (!section || !content || !headline) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        // =====================================================================
        // Text split animation - headline words stagger in
        // Tweak: HEADLINE_STAGGER controls word delay, HEADLINE_DURATION controls speed
        // =====================================================================
        const HEADLINE_STAGGER = 0.08
        const HEADLINE_DURATION = 0.7
        const HEADLINE_DELAY = 0.3

        if (!isReduced) {
          const { elements, restore } = applySplitText(headline, 'words', 'hero')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 40, rotateX: -15 })

          gsap.to(elements, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: HEADLINE_DURATION,
            stagger: HEADLINE_STAGGER,
            delay: HEADLINE_DELAY,
            ease: 'power3.out',
          })
        }

        // =====================================================================
        // Subhead fade in
        // Tweak: SUBHEAD_DELAY is relative to headline completion
        // =====================================================================
        const SUBHEAD_DELAY = 0.8
        const SUBHEAD_DURATION = 0.6

        if (subhead) {
          if (isReduced) {
            gsap.set(subhead, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              subhead,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: SUBHEAD_DURATION,
                delay: SUBHEAD_DELAY,
                ease: 'power2.out',
              }
            )
          }
        }

        // =====================================================================
        // CTA buttons slide up
        // Tweak: CTA_DELAY, CTA_STAGGER for button timing
        // =====================================================================
        const CTA_DELAY = 1.1
        const CTA_DURATION = 0.55
        const CTA_STAGGER = 0.12

        if (cta) {
          const buttons = cta.querySelectorAll('.hero-cta')
          if (isReduced) {
            gsap.set(buttons, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              buttons,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: CTA_DURATION,
                stagger: CTA_STAGGER,
                delay: CTA_DELAY,
                ease: 'power2.out',
              }
            )
          }
        }

        // =====================================================================
        // Scroll parallax - content moves up, scene intensifies
        // Tweak: CONTENT_PARALLAX_Y controls how far content moves
        // =====================================================================
        const CONTENT_PARALLAX_Y = -80

        if (!isReduced) {
          // Content parallax on scroll
          gsap.to(content, {
            y: CONTENT_PARALLAX_Y,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })

          // Track scroll progress for WebGL scene
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              setScrollProgress(self.progress)
            },
          })

          // Scene container parallax (slower than content for depth)
          if (sceneContainer) {
            gsap.to(sceneContainer, {
              y: CONTENT_PARALLAX_Y * 0.3,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
              },
            })
          }
        }
      }, section)
    }

    void setup()

    return () => {
      killed = true
      splitRestore?.()
      ctx?.revert()
    }
  }, [])

  const shouldShowWebGL = webGLSupported && !prefersReducedMotion() && showScene

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden scroll-mt-[var(--va-nav-h)]"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] bg-accent-500/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[40rem] h-[40rem] bg-primary-500/15 rounded-full blur-[120px]" />
      </div>

      {/* WebGL Scene or Fallback */}
      <div
        ref={sceneContainerRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {shouldShowWebGL ? (
          <HeroScene
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
            className="absolute inset-0 opacity-70"
          />
        ) : (
          <StaticFallback />
        )}
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-10rem)]"
        >
          {/* Left: Text content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-6">
              Robotics & Automation Systems
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] mb-8 word-spacing-wide"
              style={{ perspective: '1000px' }}
            >
              Precision systems for modern manufacturing
            </h1>

            {/* Subhead */}
            <p
              ref={subheadRef}
              className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-10 max-w-xl opacity-0"
            >
              We engineer and deploy premium robotic cells that increase throughput, reduce defects,
              and keep operations running smoothly—shift after shift.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <MagneticButton href="/solutions" variant="primary">
                Explore Systems
              </MagneticButton>
              <MagneticButton href="/contact" variant="secondary">
                Request Integration
              </MagneticButton>
            </div>
          </div>

          {/* Right side is the WebGL scene (positioned absolutely) */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-neutral-600 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-neutral-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

