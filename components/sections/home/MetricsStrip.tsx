'use client'

import { useEffect, useRef } from 'react'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'

// ============================================================================
// Metrics Data
// ============================================================================

interface Metric {
  value: number
  suffix: string
  label: string
  description: string
}

const metrics: Metric[] = [
  {
    value: 500,
    suffix: '+',
    label: 'Systems Deployed',
    description: 'Operational installations worldwide',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Average Uptime',
    description: 'Reliability across supported lines',
  },
  {
    value: 40,
    suffix: '+',
    label: 'Countries',
    description: 'Global production environments',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Years',
    description: 'Automation expertise',
  },
]

// ============================================================================
// Main MetricsStrip Section
// ============================================================================

export default function MetricsStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current

    if (!section || !grid) return

    const numberEls = Array.from(grid.querySelectorAll<HTMLElement>('[data-metric-value]'))
    if (!numberEls.length) return

    // Reduced motion: just show final values
    if (prefersReducedMotion()) {
      numberEls.forEach((el) => {
        el.textContent = el.dataset.value || '0'
      })
      return
    }

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        // =====================================================================
        // Count-up animation
        // Tweak: COUNT_DURATION controls how long the count takes
        // =====================================================================
        const COUNT_DURATION = 1.6

        numberEls.forEach((el) => {
          const endValue = parseFloat(el.dataset.value || '0')
          const isDecimal = endValue % 1 !== 0

          const obj = { val: 0 }
          gsap.to(obj, {
            val: endValue,
            duration: COUNT_DURATION,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
            onUpdate: () => {
              el.textContent = isDecimal
                ? obj.val.toFixed(1)
                : Math.round(obj.val).toString()
            },
          })
        })

        // Fade in the items
        const items = grid.querySelectorAll('[data-metric-item]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }, section)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <Section
      id="metrics"
      className="bg-neutral-900/50 border-y border-neutral-800"
      variant="tight"
    >
      <section ref={sectionRef}>
        <div className="container-custom">
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                data-metric-item
                className="text-center opacity-0"
              >
                <div className="mb-2">
                  <span
                    data-metric-value
                    data-value={metric.value}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent-400 tabular-nums"
                  >
                    0
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent-400/70">
                    {metric.suffix}
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-200 mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-neutral-500">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

