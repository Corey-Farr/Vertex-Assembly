'use client'

import { forwardRef } from 'react'
import { revealOnScroll } from '@/lib/animations'
import { useEffect, useRef } from 'react'

const stats = [
  { number: 500, suffix: '+', label: 'Systems Deployed', description: 'Worldwide installations' },
  { number: 98, suffix: '%', label: 'Uptime', description: 'Average system reliability' },
  { number: 40, suffix: '+', label: 'Countries', description: 'Global presence' },
  { number: 15, suffix: '+', label: 'Years', description: 'Industry leadership' },
]

const Stats = forwardRef<HTMLElement>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const statItems = containerRef.current.querySelectorAll('.stat-item')
      statItems.forEach((item, index) => {
        revealOnScroll(item, { delay: index * 0.1 })
      })
    }
  }, [])

  return (
    <section ref={ref} className="section relative bg-neutral-900/50">
      <div className="container-custom">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center opacity-0"
            >
              <div className="mb-4">
                <span
                  className="stat-number text-5xl md:text-6xl font-bold text-accent-400 block"
                  data-end={stat.number}
                  data-suffix={stat.suffix}
                >
                  {stat.number}{stat.suffix}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-2">{stat.label}</h3>
              <p className="text-sm text-neutral-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

Stats.displayName = 'Stats'

export default Stats

