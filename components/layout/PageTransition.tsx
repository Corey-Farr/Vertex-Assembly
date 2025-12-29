'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, y: 0 })
      return
    }

    // Fade + slight translate transition
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    )
  }, [children])

  return (
    <div ref={containerRef} className="opacity-0">
      {children}
    </div>
  )
}

