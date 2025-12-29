'use client'

import { useEffect, useRef } from 'react'
import { revealOnScroll } from '@/lib/animations'

const values = [
  {
    title: 'Precision',
    description: 'Every system we design meets the highest standards of accuracy and reliability.',
  },
  {
    title: 'Innovation',
    description: 'We leverage cutting-edge technology to solve complex manufacturing challenges.',
  },
  {
    title: 'Partnership',
    description: 'We work closely with clients to understand their unique needs and goals.',
  },
  {
    title: 'Excellence',
    description: 'Quality is at the core of everything we do, from design to implementation.',
  },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heroRef.current) {
      revealOnScroll(heroRef.current)
    }
    if (storyRef.current) {
      revealOnScroll(storyRef.current)
    }
    if (valuesRef.current) {
      const items = valuesRef.current.querySelectorAll('.value-item')
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
          <div ref={heroRef} className="max-w-3xl mx-auto text-center opacity-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide">
              About Vertex Assembly
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Leading the future of industrial automation with precision, innovation, and excellence
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div ref={storyRef} className="max-w-4xl mx-auto opacity-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white word-spacing-wide">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
              <p>
                Founded in 2009, Vertex Assembly has been at the forefront of industrial automation
                and robotics innovation. What started as a small team of engineers with a vision
                has grown into a global leader in automated production systems.
              </p>
              <p>
                Our mission is to empower manufacturers with cutting-edge automation solutions that
                drive efficiency, quality, and growth. We combine deep technical expertise with a
                commitment to understanding each client's unique challenges and goals.
              </p>
              <p>
                Today, we've deployed over 500 automation systems across 40+ countries, serving
                industries from automotive to pharmaceuticals, electronics to food processing.
                Every project is an opportunity to push the boundaries of what's possible in
                manufacturing automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white word-spacing-wide">
              Our Values
            </h2>
            <p className="text-lg text-neutral-400">
              The principles that guide everything we do
            </p>
          </div>
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-item opacity-0 p-8 border border-neutral-800 rounded-lg bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

