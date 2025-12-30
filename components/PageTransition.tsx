'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, motionDuration, prefersReducedMotion } from '@/lib/gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  const [rendered, setRendered] = useState(children)
  const lastPathRef = useRef(pathname)
  const firstRef = useRef(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (prefersReducedMotion()) {
      setRendered(children)
      gsap.set(el, { opacity: 1 })
      lastPathRef.current = pathname
      firstRef.current = false
      return
    }

    // First paint: only fade in (no y transform to avoid scroll interference)
    if (firstRef.current) {
      setRendered(children)
      gsap.set(el, { opacity: 0 })
      gsap.to(el, {
        opacity: 1,
        duration: motionDuration(0.5),
        ease: 'power2.out',
      })
      lastPathRef.current = pathname
      firstRef.current = false
      return
    }

    // Route change: fade out old content, swap, then fade in
    if (lastPathRef.current !== pathname) {
      const tl = gsap.timeline()
      tl.to(el, {
        opacity: 0,
        duration: motionDuration(0.2),
        ease: 'power1.inOut',
      })
        .add(() => setRendered(children))
        .set(el, { opacity: 0 })
        .to(el, {
          opacity: 1,
          duration: motionDuration(0.4),
          ease: 'power2.out',
        })

      lastPathRef.current = pathname
      return () => {
        tl.kill()
      }
    }

    // Same route; just update
    setRendered(children)
  }, [pathname, children])

  return (
    <div ref={containerRef}>
      {rendered}
    </div>
  )
}
