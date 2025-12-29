'use client'

import { useEffect, useRef } from 'react'
import { revealOnScroll } from '@/lib/animations'
import Link from 'next/link'

const solutions = [
  {
    id: 'automation',
    title: 'Industrial Automation',
    description: 'End-to-end automation solutions that streamline production workflows and maximize efficiency.',
    features: [
      'PLC and SCADA integration',
      'Real-time monitoring and analytics',
      'Predictive maintenance systems',
      'Custom control panel design',
    ],
    icon: '⚙️',
  },
  {
    id: 'robotics',
    title: 'Robotic Systems',
    description: 'Advanced robotic solutions for precision tasks, from assembly to material handling.',
    features: [
      '6-axis articulated robots',
      'Collaborative robot integration',
      'Vision-guided systems',
      'End-of-arm tooling design',
    ],
    icon: '🤖',
  },
  {
    id: 'production',
    title: 'Production Systems',
    description: 'Complete production line design and optimization for scalable manufacturing operations.',
    features: [
      'Line balancing and optimization',
      'Material flow analysis',
      'Quality control integration',
      'Scalable architecture design',
    ],
    icon: '🏭',
  },
]

export default function SolutionsPage() {
  const titleRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      revealOnScroll(titleRef.current)
    }
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('.solution-section')
      sections.forEach((section, index) => {
        revealOnScroll(section, { delay: index * 0.1 })
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
              Solutions
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Comprehensive automation and robotics solutions tailored to your manufacturing needs
            </p>
          </div>
        </div>
      </section>

      {/* Solutions List */}
      <section ref={sectionsRef} className="section bg-neutral-900/30">
        <div className="container-custom">
          <div className="space-y-24">
            {solutions.map((solution, index) => (
              <div
                key={solution.id}
                id={solution.id}
                className="solution-section opacity-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 0 ? '' : 'lg:order-2'}>
                    <div className="text-6xl mb-6">{solution.icon}</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white word-spacing-wide">
                      {solution.title}
                    </h2>
                    <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
                      {solution.description}
                    </p>
                    <ul className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-400">
                          <svg
                            className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 0 ? 'lg:order-2' : ''}>
                    <div className="h-96 bg-gradient-to-br from-accent-600/20 to-primary-600/20 rounded-lg border border-neutral-800 flex items-center justify-center">
                      <span className="text-neutral-500 text-sm">Solution Visualization</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-neutral-400 mb-8">
              Contact us to discuss your automation needs
            </p>
            <Link href="/contact" className="btn-primary">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

