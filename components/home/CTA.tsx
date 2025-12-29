'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealOnScroll, revealText } from '@/lib/animations'

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      revealOnScroll(contentRef.current)
      const title = contentRef.current.querySelector('.cta-title')
      if (title) {
        revealText(title, { type: 'word', delay: 0.2, stagger: 0.05 })
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="section relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 via-primary-900/20 to-neutral-900" />
      
      <div className="container-custom relative z-10">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center opacity-0">
          <h2 className="cta-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white word-spacing-wide">
            Ready to Transform Your Production?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
            Let's discuss how Vertex Assembly can optimize your manufacturing operations with cutting-edge automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Get Started
            </Link>
            <Link href="/solutions" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

