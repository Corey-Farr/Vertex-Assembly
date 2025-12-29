'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { revealOnScroll } from '@/lib/animations'
import { useEffect, useRef } from 'react'

const Hero = forwardRef<HTMLElement>((_props, ref) => {
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ctaRef.current) {
      revealOnScroll(ctaRef.current, { delay: 0.3 })
    }
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white word-spacing-wide">
            Precision in Motion
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed word-spacing-normal">
            Advanced robotics and automated production systems that redefine manufacturing excellence
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/solutions" className="btn-primary">
              Explore Solutions
            </Link>
            <Link href="/work" className="btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-neutral-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero

