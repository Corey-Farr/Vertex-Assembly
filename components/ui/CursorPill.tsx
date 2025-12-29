'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/gsap'

interface CursorPillProps {
  /** Text to display in the pill */
  label?: string
  /** Parent container ref to track mouse within */
  containerRef: React.RefObject<HTMLElement>
  /** Whether the cursor is currently over the container */
  isHovered: boolean
}

/**
 * A cursor-following pill that appears on hover
 * Only renders on desktop; hidden on touch/mobile devices
 */
export default function CursorPill({
  label = 'View',
  containerRef,
  isHovered,
}: CursorPillProps) {
  const pillRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // Check if we're on desktop (no touch / wide viewport)
  useEffect(() => {
    const checkDesktop = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isWide = window.innerWidth >= 768
      setIsDesktop(!hasTouch && isWide)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!isDesktop || !containerRef.current || !pillRef.current) return
    if (prefersReducedMotion()) return

    const container = containerRef.current
    const pill = pillRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Smooth follow with GSAP
      gsap.to(pill, {
        x: x,
        y: y,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [isDesktop, containerRef])

  // Show/hide animation
  useEffect(() => {
    if (!pillRef.current || !isDesktop) return
    if (prefersReducedMotion()) return

    gsap.to(pillRef.current, {
      scale: isHovered ? 1 : 0,
      opacity: isHovered ? 1 : 0,
      duration: 0.2,
      ease: isHovered ? 'back.out(2)' : 'power2.in',
    })
  }, [isHovered, isDesktop])

  // Don't render on mobile/touch
  if (!isDesktop) return null

  return (
    <div
      ref={pillRef}
      className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ opacity: 0, transform: 'translate(-50%, -50%) scale(0)' }}
    >
      <div className="px-4 py-2 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-accent-500/30 whitespace-nowrap">
        {label}
      </div>
    </div>
  )
}

