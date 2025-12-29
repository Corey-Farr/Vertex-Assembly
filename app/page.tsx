'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealText, revealOnScroll, parallax, countUp } from '@/lib/animations'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import SolutionsPreview from '@/components/home/SolutionsPreview'
import WorkPreview from '@/components/home/WorkPreview'
import CTA from '@/components/home/CTA'

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Animate hero text
    if (heroRef.current) {
      const heroTitle = heroRef.current.querySelector('.hero-title')
      const heroSubtitle = heroRef.current.querySelector('.hero-subtitle')
      
      if (heroTitle) {
        revealText(heroTitle, { type: 'word', delay: 0.2, stagger: 0.05 })
      }
      if (heroSubtitle) {
        revealText(heroSubtitle, { type: 'word', delay: 0.8, stagger: 0.03 })
      }
    }

    // Animate stats on scroll
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number')
      statNumbers.forEach((stat) => {
        const endValue = parseInt(stat.getAttribute('data-end') || '0')
        countUp(stat, {
          end: endValue,
          duration: 2,
          suffix: stat.getAttribute('data-suffix') || '',
        })
      })
    }
  }, [])

  return (
    <div className="relative">
      {/* Grid overlay - subtle background pattern */}
      <div className="fixed inset-0 grid-overlay pointer-events-none opacity-30" />

      <Hero ref={heroRef} />
      <Stats ref={statsRef} />
      <SolutionsPreview />
      <WorkPreview />
      <CTA />
    </div>
  )
}

