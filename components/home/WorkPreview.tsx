'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealOnScroll, parallax } from '@/lib/animations'

const featuredWork = [
  {
    title: 'Automotive Assembly Line',
    category: 'Manufacturing',
    description: 'Complete transformation of a 50,000 sq ft production facility with 200+ robotic units.',
    gradient: 'from-accent-600 to-primary-600',
  },
  {
    title: 'Pharmaceutical Packaging',
    category: 'Healthcare',
    description: 'Sterile environment automation with 99.9% accuracy in high-volume packaging operations.',
    gradient: 'from-primary-600 to-accent-500',
  },
  {
    title: 'Electronics Manufacturing',
    category: 'Technology',
    description: 'Precision assembly systems handling micro-components with sub-millimeter accuracy.',
    gradient: 'from-accent-500 to-primary-500',
  },
]

export default function WorkPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      revealOnScroll(titleRef.current)
    }
    if (gridRef.current) {
      const items = gridRef.current.querySelectorAll('.work-item')
      items.forEach((item, index) => {
        revealOnScroll(item, { delay: index * 0.1 })
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="section relative bg-neutral-900/30">
      <div className="container-custom">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white word-spacing-wide">
            Featured Projects
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Transformative automation solutions across industries
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredWork.map((work, index) => (
            <Link
              key={index}
              href="/work"
              className="work-item opacity-0 group block relative overflow-hidden rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-300"
            >
              <div className={`h-64 bg-gradient-to-br ${work.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-neutral-950/90 via-neutral-950/50 to-transparent">
                <span className="text-xs font-semibold text-accent-400 mb-2 uppercase tracking-wider">
                  {work.category}
                </span>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-accent-400 transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-neutral-300 line-clamp-2">{work.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/work" className="btn-secondary">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}

