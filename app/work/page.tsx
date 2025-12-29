'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealOnScroll } from '@/lib/animations'

// This would typically come from MDX files, but for now we'll use placeholder data
const workItems = [
  {
    slug: 'automotive-assembly',
    title: 'Automotive Assembly Line',
    category: 'Manufacturing',
    year: '2024',
    description: 'Complete transformation of a 50,000 sq ft production facility with 200+ robotic units.',
    gradient: 'from-accent-600 to-primary-600',
  },
  {
    slug: 'pharmaceutical-packaging',
    title: 'Pharmaceutical Packaging',
    category: 'Healthcare',
    year: '2023',
    description: 'Sterile environment automation with 99.9% accuracy in high-volume packaging operations.',
    gradient: 'from-primary-600 to-accent-500',
  },
  {
    slug: 'electronics-manufacturing',
    title: 'Electronics Manufacturing',
    category: 'Technology',
    year: '2023',
    description: 'Precision assembly systems handling micro-components with sub-millimeter accuracy.',
    gradient: 'from-accent-500 to-primary-500',
  },
  {
    slug: 'food-processing',
    title: 'Food Processing Automation',
    category: 'Food & Beverage',
    year: '2022',
    description: 'Hygienic automation systems for high-speed food processing and packaging.',
    gradient: 'from-primary-500 to-accent-400',
  },
]

export default function WorkPage() {
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
    <div className="pt-20">
      {/* Hero */}
      <section className="section">
        <div className="container-custom">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center opacity-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide">
              Our Work
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Transformative automation solutions across diverse industries
            </p>
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workItems.map((work, index) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="work-item opacity-0 group block relative overflow-hidden rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-300"
              >
                <div className={`h-80 bg-gradient-to-br ${work.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-transparent">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                        {work.category}
                      </span>
                      <span className="text-xs text-neutral-500">{work.year}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-accent-400 transition-colors">
                      {work.title}
                    </h2>
                  </div>
                  <p className="text-sm text-neutral-300 line-clamp-2">{work.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

