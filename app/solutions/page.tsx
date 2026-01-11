'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ensureScrollTrigger, gsap, prefersReducedMotion, motionDuration } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

// ============================================================================
// Solutions Data
// ============================================================================

const solutions = [
  {
    id: 'automation',
    title: 'Industrial Automation',
    shortDesc: 'End-to-end automation for production workflows',
    description:
      'Comprehensive automation solutions that streamline production workflows, eliminate bottlenecks, and maximize operational efficiency. From PLC programming to SCADA integration, we engineer systems that scale with your operations.',
    features: [
      'PLC and SCADA system integration',
      'Real-time monitoring dashboards',
      'Predictive maintenance systems',
      'Custom control panel design',
      'OEE optimization protocols',
    ],
    stats: { efficiency: '+47%', downtime: '-62%' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'robotics',
    title: 'Robotic Systems',
    shortDesc: 'Advanced robotics for precision manufacturing',
    description:
      'State-of-the-art robotic solutions engineered for precision tasks. From assembly to material handling, our systems integrate seamlessly with your production line, delivering consistent quality at scale.',
    features: [
      '6-axis articulated robot deployment',
      'Collaborative robot (cobot) integration',
      'Vision-guided picking systems',
      'Custom end-of-arm tooling design',
      'Path optimization algorithms',
    ],
    stats: { precision: '±0.02mm', throughput: '+85%' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    id: 'production',
    title: 'Production Line Design',
    shortDesc: 'Complete production system engineering',
    description:
      'Full-scale production line design and optimization. We analyze material flow, balance workstations, and architect systems that meet your capacity targets while maintaining flexibility for future growth.',
    features: [
      'Line balancing and optimization',
      'Material flow analysis',
      'Quality control integration',
      'Scalable architecture design',
      'Digital twin simulation',
    ],
    stats: { capacity: '+120%', waste: '-38%' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'integration',
    title: 'System Integration',
    shortDesc: 'Seamless connectivity across your operation',
    description:
      'Expert system integration services that connect disparate machines, sensors, and software into a unified, intelligent manufacturing ecosystem. We bridge legacy systems with modern automation.',
    features: [
      'Legacy system modernization',
      'IoT sensor networks',
      'MES/ERP connectivity',
      'Real-time data pipelines',
      'API-first architecture',
    ],
    stats: { connectivity: '100%', latency: '<5ms' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    shortDesc: 'Strategic guidance for automation initiatives',
    description:
      'Strategic consulting to help you navigate automation investments. From feasibility studies to technology roadmaps, we provide the expertise needed to make informed decisions and maximize ROI.',
    features: [
      'Automation feasibility studies',
      'Technology roadmapping',
      'Vendor selection support',
      'ROI analysis & projections',
      'Change management guidance',
    ],
    stats: { roi: '340%', timeline: '-45%' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
]

// ============================================================================
// Accordion Item Component
// ============================================================================

interface AccordionItemProps {
  item: (typeof solutions)[0]
  isOpen: boolean
  onToggle: () => void
  index: number
}

function AccordionItem({ item, isOpen, onToggle, index }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Animate height and opacity
  useEffect(() => {
    const content = contentRef.current
    const inner = innerRef.current
    if (!content || !inner) return

    if (prefersReducedMotion()) {
      content.style.height = isOpen ? `${inner.offsetHeight}px` : '0px'
      content.style.opacity = isOpen ? '1' : '0'
      return
    }

    if (isOpen) {
      // Opening: animate height and opacity
      gsap.to(content, {
        height: inner.offsetHeight,
        duration: 0.5,
        ease: 'power3.out',
      })
      gsap.to(content, {
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
        ease: 'power2.out',
      })
    } else {
      // Closing: animate opacity first, then height
      gsap.to(content, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      })
      gsap.to(content, {
        height: 0,
        duration: 0.4,
        delay: 0.1,
        ease: 'power3.inOut',
      })
    }
  }, [isOpen])

  return (
    <div
      className={`accordion-item border border-neutral-800 rounded-xl bg-neutral-900/40 backdrop-blur-sm overflow-hidden transition-colors duration-300 ${
        isOpen ? 'border-accent-500/40' : 'hover:border-neutral-700'
      }`}
      style={{ opacity: 0, transform: 'translateY(30px)' }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 md:gap-6">
          {/* Icon */}
          <div
            className={`flex-shrink-0 p-3 rounded-lg transition-colors duration-300 ${
              isOpen
                ? 'bg-accent-500/20 text-accent-400'
                : 'bg-neutral-800/60 text-neutral-400 group-hover:bg-neutral-800 group-hover:text-neutral-300'
            }`}
          >
            {item.icon}
          </div>

          {/* Title + Short Description */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-0.5">{item.title}</h3>
            <p className="text-sm text-neutral-500 hidden sm:block">{item.shortDesc}</p>
          </div>
        </div>

        {/* Toggle Icon */}
        <div
          className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 ${
            isOpen ? 'bg-accent-500/20 rotate-180' : 'bg-neutral-800/60 group-hover:bg-neutral-800'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-neutral-400 transition-transform duration-300"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div ref={innerRef} className="px-6 pb-6 md:px-8 md:pb-8">
          {/* Description */}
          <p className="text-neutral-300 leading-relaxed mb-6 pl-0 md:pl-[4.5rem]">
            {item.description}
          </p>

          {/* Features + Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-0 md:pl-[4.5rem]">
            {/* Features */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400/70 mb-4">
                Capabilities
              </h4>
              <ul className="space-y-2.5">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-400">
                    <svg
                      className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 lg:justify-end lg:items-start">
              {Object.entries(item.stats).map(([key, value]) => (
                <div
                  key={key}
                  className="px-5 py-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50"
                >
                  <div className="text-2xl font-bold text-accent-400 mb-1">{value}</div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Integration Diagram SVG
// ============================================================================

function IntegrationDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const paths = svg.querySelectorAll('.draw-path')
      const nodes = svg.querySelectorAll('.diagram-node')
      const labels = svg.querySelectorAll('.diagram-label')

      if (prefersReducedMotion()) {
        paths.forEach((path) => {
          ;(path as SVGPathElement).style.strokeDashoffset = '0'
        })
        gsap.set(nodes, { opacity: 1, scale: 1 })
        gsap.set(labels, { opacity: 1 })
        return
      }

      // Set initial states
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength()
        ;(path as SVGPathElement).style.strokeDasharray = `${length}`
        ;(path as SVGPathElement).style.strokeDashoffset = `${length}`
      })
      gsap.set(nodes, { opacity: 0, scale: 0.5 })
      gsap.set(labels, { opacity: 0 })

      ctx = gsap.context(() => {
        // Draw paths on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        })

        // Animate paths
        paths.forEach((path, index) => {
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: 'none',
            },
            index * 0.15
          )
        })

        // Animate nodes after paths
        tl.to(
          nodes,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          },
          0.3
        )

        // Animate labels
        tl.to(
          labels,
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
          },
          0.5
        )
      }, svg)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 400"
      fill="none"
      className="w-full max-w-4xl mx-auto"
      aria-label="Integration system diagram showing connected components"
    >
      {/* Background grid pattern */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-800/50" />
        </pattern>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="400" fill="url(#grid)" />

      {/* Central hub */}
      <circle className="diagram-node" cx="400" cy="200" r="45" fill="#171717" stroke="#0ea5e9" strokeWidth="2" filter="url(#glow)" />
      <circle className="diagram-node" cx="400" cy="200" r="30" fill="#0ea5e9" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1" />
      <text className="diagram-label" x="400" y="205" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">VERTEX</text>

      {/* Sensors node - top left */}
      <circle className="diagram-node" cx="150" cy="100" r="35" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="150" y="105" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">SENSORS</text>

      {/* PLC node - top right */}
      <circle className="diagram-node" cx="650" cy="100" r="35" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="650" y="105" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">PLC</text>

      {/* Robots node - bottom left */}
      <circle className="diagram-node" cx="150" cy="300" r="35" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="150" y="305" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">ROBOTS</text>

      {/* MES node - bottom right */}
      <circle className="diagram-node" cx="650" cy="300" r="35" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="650" y="305" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">MES/ERP</text>

      {/* HMI node - left */}
      <circle className="diagram-node" cx="100" cy="200" r="28" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="100" y="205" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">HMI</text>

      {/* Cloud node - right */}
      <circle className="diagram-node" cx="700" cy="200" r="28" fill="#171717" stroke="#627d98" strokeWidth="1.5" />
      <text className="diagram-label" x="700" y="205" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontWeight="500">CLOUD</text>

      {/* Connection paths */}
      <path className="draw-path" d="M 185 115 Q 280 150 355 185" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="draw-path" d="M 615 115 Q 520 150 445 185" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="draw-path" d="M 185 285 Q 280 250 355 215" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="draw-path" d="M 615 285 Q 520 250 445 215" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="draw-path" d="M 128 200 L 355 200" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="draw-path" d="M 445 200 L 672 200" stroke="url(#pathGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Orbiting dots animation (CSS-driven) */}
      <circle cx="270" cy="160" r="3" fill="#38bdf8" className="animate-pulse" />
      <circle cx="530" cy="160" r="3" fill="#38bdf8" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <circle cx="270" cy="240" r="3" fill="#38bdf8" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
      <circle cx="530" cy="240" r="3" fill="#38bdf8" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
    </svg>
  )
}

// ============================================================================
// Main Solutions Page
// ============================================================================

export default function SolutionsPage() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)
  const diagramSectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Hero text reveal animation
  useEffect(() => {
    const hero = heroRef.current
    const headline = headlineRef.current
    const subhead = subheadRef.current

    if (!hero || !headline) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      await ensureScrollTrigger()
      if (killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        if (!isReduced) {
          // Split headline into words
          const { elements, restore } = applySplitText(headline, 'words', 'solutions-hero')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 50, rotateX: -20 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.06,
            delay: 0.2,
            ease: 'power3.out',
          })
        }

        // Subhead fade in
        if (subhead) {
          if (isReduced) {
            gsap.set(subhead, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              subhead,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.7,
                ease: 'power2.out',
              }
            )
          }
        }
      }, hero)
    }

    void setup()

    return () => {
      killed = true
      splitRestore?.()
      ctx?.revert()
    }
  }, [])

  // Accordion items reveal animation
  useEffect(() => {
    const accordion = accordionRef.current
    if (!accordion) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const items = accordion.querySelectorAll('.accordion-item')

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: accordion,
            start: 'top 80%',
            once: true,
          },
        })
      }, accordion)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  // Diagram section reveal
  useEffect(() => {
    const diagramSection = diagramSectionRef.current
    if (!diagramSection) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const title = diagramSection.querySelector('.diagram-title')
      const subtitle = diagramSection.querySelector('.diagram-subtitle')

      if (prefersReducedMotion()) {
        gsap.set([title, subtitle], { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          [title, subtitle],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: diagramSection,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }, diagramSection)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  // CTA reveal
  useEffect(() => {
    const cta = ctaRef.current
    if (!cta) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const content = cta.querySelector('.cta-content')

      if (prefersReducedMotion()) {
        gsap.set(content, { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          content,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cta,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }, cta)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  const handleAccordionToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <div className="pt-20">
      {/* ================================================================== */}
      {/* Hero Section */}
      {/* ================================================================== */}
      <section
        ref={heroRef}
        className="relative section overflow-hidden"
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '3rem 3rem',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[50rem] h-[50rem] bg-accent-500/10 rounded-full blur-[150px]" />
          <div className="absolute -bottom-40 right-1/4 w-[40rem] h-[40rem] bg-primary-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              Comprehensive Solutions
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 word-spacing-wide leading-[1.1]"
              style={{ perspective: '1000px' }}
            >
              Engineering automation that transforms operations
            </h1>

            {/* Subhead */}
            <p
              ref={subheadRef}
              className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto opacity-0"
            >
              From robotic systems to complete production line design, we deliver precision-engineered solutions that maximize efficiency and scale with your business.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Solutions Accordion Section */}
      {/* ================================================================== */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Solutions
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto">
                Explore our comprehensive suite of automation and integration services
              </p>
            </div>

            {/* Accordion */}
            <div ref={accordionRef} className="space-y-4">
              {solutions.map((solution, index) => (
                <AccordionItem
                  key={solution.id}
                  item={solution}
                  isOpen={openIndex === index}
                  onToggle={() => handleAccordionToggle(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Integration Diagram Section */}
      {/* ================================================================== */}
      <section ref={diagramSectionRef} className="section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="diagram-title text-3xl md:text-4xl font-bold text-white mb-4 opacity-0">
              Seamless System Integration
            </h2>
            <p className="diagram-subtitle text-neutral-400 max-w-xl mx-auto opacity-0">
              Our solutions connect every component of your operation into a unified, intelligent ecosystem
            </p>
          </div>

          <div className="relative">
            {/* Glow effect behind diagram */}
            <div className="absolute inset-0 bg-accent-500/5 blur-[100px] rounded-full transform scale-75" />
            <IntegrationDiagram />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA Banner Section */}
      {/* ================================================================== */}
      <section ref={ctaRef} className="section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/30 via-primary-900/20 to-neutral-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] bg-accent-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="cta-content max-w-3xl mx-auto text-center opacity-0">
            {/* Eyebrow */}
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              Ready to Transform?
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 word-spacing-wide text-balance">
              Let&apos;s engineer your competitive advantage.
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Schedule a consultation to discuss your automation goals. We&apos;ll analyze your operation and propose solutions tailored to your needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wide text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-colors duration-300 group"
              >
                <span>Schedule Consultation</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wide text-neutral-200 border border-neutral-600 rounded-lg hover:border-neutral-400 hover:text-white transition-colors duration-300"
              >
                View Our Work
              </Link>
            </div>

            {/* Trust signal */}
            <p className="mt-10 text-sm text-neutral-500">
              500+ systems deployed • 40+ countries • 99.7% uptime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
