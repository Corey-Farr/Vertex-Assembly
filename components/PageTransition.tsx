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
      gsap.set(el, { opacity: 1, y: 0 })
      lastPathRef.current = pathname
      firstRef.current = false
      return
    }

    // First paint: only fade/slide in.
    if (firstRef.current) {
      setRendered(children)
      gsap.set(el, { opacity: 0, y: 14 })
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: motionDuration(0.55),
        ease: 'power2.out',
        onComplete: () => {
          // Important: clear transforms so ScrollTrigger pinning (fixed) isn't broken
          // by a transformed ancestor. This prevents pinned sections from “disappearing”.
          gsap.set(el, { clearProps: 'transform' })
        },
      })
      lastPathRef.current = pathname
      firstRef.current = false
      return
    }

    // Route change: fade out old content, swap, then fade in.
    if (lastPathRef.current !== pathname) {
      const tl = gsap.timeline()
      tl.to(el, {
        opacity: 0,
        y: -10,
        duration: motionDuration(0.22),
        ease: 'power1.inOut',
      })
        .add(() => setRendered(children))
        .set(el, { opacity: 0, y: 14 })
        .to(el, {
          opacity: 1,
          y: 0,
          duration: motionDuration(0.45),
          ease: 'power2.out',
        })
        .set(el, { clearProps: 'transform' })

      lastPathRef.current = pathname
      return () => {
        tl.kill()
      }
    }

    // Same route; just update.
    setRendered(children)
  }, [pathname, children])

  return (
    <div ref={containerRef} className="will-change-transform">
      {rendered}
    </div>
  )
}


