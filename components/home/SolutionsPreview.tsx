'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealOnScroll, parallax } from '@/lib/animations'

const solutions = [
  {
    title: 'Automated Assembly',
    description: 'High-precision robotic systems for complex assembly operations with unmatched accuracy.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Quality Control',
    description: 'AI-powered inspection systems ensuring perfection at every stage of production.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Material Handling',
    description: 'Intelligent logistics systems that optimize flow and reduce operational costs.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

export default function SolutionsPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      revealOnScroll(titleRef.current)
    }
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.solution-card')
      cards.forEach((card, index) => {
        revealOnScroll(card, { delay: index * 0.15 })
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="section relative">
      <div className="container-custom">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white word-spacing-wide">
            Integrated Solutions
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Comprehensive automation systems designed for scale, precision, and reliability
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="solution-card opacity-0 group p-8 border border-neutral-800 rounded-lg bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300"
            >
              <div className="text-accent-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {solution.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{solution.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/solutions" className="btn-secondary">
            View All Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}

