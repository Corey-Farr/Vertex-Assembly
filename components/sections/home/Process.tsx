'use client'

import { useEffect, useRef, useState } from 'react'
import Section from '@/components/ui/Section'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'

// ============================================================================
// Step Data
// ============================================================================

interface Step {
  id: string
  label: string
  title: string
  body: string
  diagram: React.ReactNode
}

const steps: Step[] = [
  {
    id: 'discover',
    label: 'Discover',
    title: 'Map constraints and define targets',
    body: 'We audit your current line, document cycle times, identify bottlenecks, and establish measurable success criteria—before any engineering begins.',
    diagram: <DiagramDiscover />,
  },
  {
    id: 'model',
    label: 'Model',
    title: 'Simulate before you build',
    body: 'Using digital twins and offline programming, we validate cell layouts, robot paths, and safety zones—catching integration issues in software, not on the floor.',
    diagram: <DiagramModel />,
  },
  {
    id: 'integrate',
    label: 'Integrate',
    title: 'Assemble and commission on-site',
    body: 'Our team deploys hardware, configures controls, and runs acceptance tests against your spec. We don\'t leave until the system hits its targets.',
    diagram: <DiagramIntegrate />,
  },
  {
    id: 'validate',
    label: 'Validate',
    title: 'Measure, tune, and support',
    body: 'Post-launch, we monitor OEE, provide remote diagnostics, and iterate on performance. Continuous improvement is built into every engagement.',
    diagram: <DiagramValidate />,
  },
]

// ============================================================================
// Placeholder Diagrams (inline SVG)
// ============================================================================

function DiagramDiscover() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid background */}
      <defs>
        <pattern id="grid-discover" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-neutral-700" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid-discover)" />
      
      {/* Factory floor outline */}
      <rect x="40" y="40" width="320" height="200" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600" strokeDasharray="8 4" />
      
      {/* Workstations */}
      <rect x="60" y="80" width="60" height="40" rx="2" className="fill-accent-500/30 stroke-accent-400" strokeWidth="1" />
      <rect x="140" y="80" width="60" height="40" rx="2" className="fill-accent-500/30 stroke-accent-400" strokeWidth="1" />
      <rect x="220" y="80" width="60" height="40" rx="2" className="fill-primary-500/30 stroke-primary-400" strokeWidth="1" />
      <rect x="300" y="80" width="40" height="40" rx="2" className="fill-neutral-700 stroke-neutral-500" strokeWidth="1" />
      
      {/* Flow arrows */}
      <path d="M125 100 L135 100" stroke="currentColor" strokeWidth="1.5" className="text-accent-400" markerEnd="url(#arrow)" />
      <path d="M205 100 L215 100" stroke="currentColor" strokeWidth="1.5" className="text-accent-400" />
      <path d="M285 100 L295 100" stroke="currentColor" strokeWidth="1.5" className="text-neutral-500" />
      
      {/* Measurement callouts */}
      <circle cx="90" cy="170" r="12" className="fill-accent-500/20 stroke-accent-400" strokeWidth="1" />
      <text x="90" y="174" textAnchor="middle" className="fill-accent-400 text-[10px] font-medium">1</text>
      
      <circle cx="170" cy="170" r="12" className="fill-accent-500/20 stroke-accent-400" strokeWidth="1" />
      <text x="170" y="174" textAnchor="middle" className="fill-accent-400 text-[10px] font-medium">2</text>
      
      <circle cx="250" cy="170" r="12" className="fill-primary-500/20 stroke-primary-400" strokeWidth="1" />
      <text x="250" y="174" textAnchor="middle" className="fill-primary-400 text-[10px] font-medium">?</text>
      
      {/* Legend */}
      <text x="60" y="260" className="fill-neutral-400 text-[11px]">Audit points</text>
      <text x="180" y="260" className="fill-neutral-400 text-[11px]">Bottleneck analysis</text>
    </svg>
  )
}

function DiagramModel() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3D grid perspective */}
      <defs>
        <linearGradient id="fade-model" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Isometric floor */}
      <path d="M200 250 L40 170 L200 90 L360 170 Z" className="fill-neutral-800/50 stroke-neutral-600" strokeWidth="1" />
      
      {/* Robot arm (simplified) */}
      <g transform="translate(180, 140)">
        <rect x="-15" y="40" width="30" height="20" rx="2" className="fill-accent-500/40 stroke-accent-400" strokeWidth="1" />
        <rect x="-8" y="10" width="16" height="35" rx="2" className="fill-accent-500/30 stroke-accent-400" strokeWidth="1" />
        <rect x="-20" y="-20" width="40" height="12" rx="2" className="fill-accent-500/40 stroke-accent-400" strokeWidth="1" transform="rotate(-15 0 -14)" />
        <circle cx="25" cy="-25" r="6" className="fill-primary-400/50 stroke-primary-400" strokeWidth="1" />
      </g>
      
      {/* Path visualization */}
      <path d="M140 180 Q200 120 260 180" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" className="text-accent-400" fill="none" />
      <circle cx="140" cy="180" r="4" className="fill-accent-400" />
      <circle cx="260" cy="180" r="4" className="fill-accent-400" />
      
      {/* Safety zone */}
      <ellipse cx="200" cy="190" rx="80" ry="30" className="fill-red-500/10 stroke-red-400/50" strokeWidth="1" strokeDasharray="4 2" />
      
      {/* Labels */}
      <text x="200" y="40" textAnchor="middle" className="fill-neutral-300 text-[12px] font-medium">Digital Twin</text>
      <text x="320" cy="190" className="fill-red-400/70 text-[10px]">Safety zone</text>
    </svg>
  )
}

function DiagramIntegrate() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines */}
      <path d="M80 150 L320 150" stroke="currentColor" strokeWidth="2" className="text-neutral-700" />
      <path d="M200 80 L200 220" stroke="currentColor" strokeWidth="2" className="text-neutral-700" />
      
      {/* Central hub */}
      <circle cx="200" cy="150" r="35" className="fill-accent-500/20 stroke-accent-400" strokeWidth="2" />
      <text x="200" y="155" textAnchor="middle" className="fill-accent-400 text-[11px] font-semibold">PLC</text>
      
      {/* Connected systems */}
      <g transform="translate(80, 150)">
        <rect x="-30" y="-25" width="60" height="50" rx="4" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" className="fill-neutral-300 text-[10px]">Robot</text>
      </g>
      
      <g transform="translate(320, 150)">
        <rect x="-30" y="-25" width="60" height="50" rx="4" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" className="fill-neutral-300 text-[10px]">Vision</text>
      </g>
      
      <g transform="translate(200, 80)">
        <rect x="-35" y="-25" width="70" height="50" rx="4" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" className="fill-neutral-300 text-[10px]">Conveyor</text>
      </g>
      
      <g transform="translate(200, 220)">
        <rect x="-30" y="-25" width="60" height="50" rx="4" className="fill-primary-500/20 stroke-primary-400" strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" className="fill-primary-300 text-[10px]">MES</text>
      </g>
      
      {/* Data flow indicators */}
      <circle cx="140" cy="150" r="4" className="fill-green-400 animate-pulse" />
      <circle cx="260" cy="150" r="4" className="fill-green-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <circle cx="200" cy="115" r="4" className="fill-green-400 animate-pulse" style={{ animationDelay: '1s' }} />
    </svg>
  )
}

function DiagramValidate() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart background */}
      <rect x="50" y="40" width="300" height="180" rx="4" className="fill-neutral-800/50 stroke-neutral-700" strokeWidth="1" />
      
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="50" y1={40 + i * 45} x2="350" y2={40 + i * 45} stroke="currentColor" strokeWidth="0.5" className="text-neutral-700" />
      ))}
      
      {/* OEE trend line */}
      <path 
        d="M70 180 L120 160 L170 170 L220 130 L270 110 L320 90" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        className="text-accent-400" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Data points */}
      {[[70, 180], [120, 160], [170, 170], [220, 130], [270, 110], [320, 90]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="fill-accent-400 stroke-neutral-900" strokeWidth="2" />
      ))}
      
      {/* Target line */}
      <line x1="50" y1="80" x2="350" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" className="text-green-400" />
      <text x="355" y="84" className="fill-green-400 text-[10px]">Target</text>
      
      {/* Y-axis labels */}
      <text x="40" y="225" textAnchor="end" className="fill-neutral-500 text-[10px]">0%</text>
      <text x="40" y="135" textAnchor="end" className="fill-neutral-500 text-[10px]">50%</text>
      <text x="40" y="48" textAnchor="end" className="fill-neutral-500 text-[10px]">100%</text>
      
      {/* Title */}
      <text x="200" y="260" textAnchor="middle" className="fill-neutral-300 text-[12px] font-medium">OEE Performance Over Time</text>
      
      {/* Current value callout */}
      <rect x="280" y="55" width="60" height="28" rx="4" className="fill-accent-500/20 stroke-accent-400" strokeWidth="1" />
      <text x="310" y="74" textAnchor="middle" className="fill-accent-400 text-[14px] font-bold">94.2%</text>
    </svg>
  )
}

// ============================================================================
// Step Indicator Component
// ============================================================================

interface StepIndicatorProps {
  step: Step
  index: number
  isActive: boolean
  isComplete: boolean
}

function StepIndicator({ step, index, isActive, isComplete }: StepIndicatorProps) {
  return (
    <div
      data-step-indicator
      data-index={index}
      className={`
        flex items-center gap-4 py-4 transition-all duration-300
        ${isActive ? 'opacity-100' : 'opacity-40'}
      `}
    >
      {/* Step number circle */}
      <div
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
          transition-all duration-300 shrink-0
          ${isActive 
            ? 'bg-accent-500 text-white scale-110' 
            : isComplete 
              ? 'bg-accent-500/30 text-accent-400 border border-accent-400/50' 
              : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
          }
        `}
      >
        {isComplete ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index + 1
        )}
      </div>
      
      {/* Step label */}
      <span
        className={`
          text-sm font-semibold uppercase tracking-[0.15em] transition-colors duration-300
          ${isActive ? 'text-accent-400' : 'text-neutral-500'}
        `}
      >
        {step.label}
      </span>
    </div>
  )
}

// ============================================================================
// Main Process Section
// ============================================================================

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const pinContainer = pinContainerRef.current
    const progressLine = progressLineRef.current
    const panels = panelsRef.current

    if (!section || !pinContainer || !progressLine || !panels) return

    let ctx: gsap.Context | null = null
    let mm: gsap.MatchMedia | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        mm = gsap.matchMedia()

        // =====================================================================
        // Desktop: Pinned timeline with step progression
        // Tweak: PIN_DISTANCE controls how long the pin lasts (in vh)
        // =====================================================================
        mm.add('(min-width: 768px)', () => {
          const PIN_DISTANCE = 400 // vh
          const stepPanels = panels.querySelectorAll('[data-step-panel]')
          const stepIndicators = pinContainer.querySelectorAll('[data-step-indicator]')

          if (isReduced) {
            // Show all content without animation
            gsap.set(progressLine, { scaleY: 1 })
            gsap.set(stepPanels, { opacity: 1, scale: 1 })
            return
          }

          // Initial state
          gsap.set(progressLine, { scaleY: 0, transformOrigin: 'top' })
          gsap.set(stepPanels, { opacity: 0, scale: 0.95 })
          gsap.set(stepPanels[0], { opacity: 1, scale: 1 })

          // Main timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinContainer,
              start: 'top top',
              end: `+=${PIN_DISTANCE}vh`,
              pin: true,
              pinType: 'transform',
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Calculate which step should be active
                const progress = self.progress
                const stepIndex = Math.min(
                  steps.length - 1,
                  Math.floor(progress * steps.length)
                )
                setActiveStep(stepIndex)
              },
            },
          })

          // Progress line grows through the entire timeline
          tl.to(progressLine, {
            scaleY: 1,
            ease: 'none',
            duration: 1,
          }, 0)

          // Step transitions
          steps.forEach((_, idx) => {
            if (idx === 0) return // First panel already visible

            const startAt = idx / steps.length
            const prevPanel = stepPanels[idx - 1]
            const currentPanel = stepPanels[idx]

            // Fade out previous panel
            tl.to(prevPanel, {
              opacity: 0,
              scale: 0.9,
              duration: 0.15,
              ease: 'power2.in',
            }, startAt - 0.05)

            // Fade in current panel
            tl.to(currentPanel, {
              opacity: 1,
              scale: 1,
              duration: 0.15,
              ease: 'power2.out',
            }, startAt)
          })
        })

        // =====================================================================
        // Mobile: Simple stacked layout with reveals
        // =====================================================================
        mm.add('(max-width: 767px)', () => {
          if (!mobileRef.current) return

          const mobileSteps = mobileRef.current.querySelectorAll('[data-mobile-step]')

          if (isReduced) {
            gsap.set(mobileSteps, { opacity: 1, y: 0 })
            return
          }

          mobileSteps.forEach((step) => {
            gsap.fromTo(
              step,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 85%',
                  once: true,
                },
              }
            )
          })
        })
      }, section)
    }

    void setup()

    return () => {
      killed = true
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  return (
    <Section id="process" className="overflow-hidden">
      <section ref={sectionRef}>
        {/* Desktop Layout */}
        <div
          ref={pinContainerRef}
          className="hidden md:block min-h-screen relative z-10 bg-neutral-950"
        >
          <div className="container-custom py-20">
            {/* Section header */}
            <div className="mb-16">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
                Our Process
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 word-spacing-wide">
                From discovery to validation.
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl">
                A proven methodology that de-risks automation projects and delivers measurable results.
              </p>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-12 gap-8 lg:gap-12">
              {/* Left: Stepper */}
              <div className="col-span-4 lg:col-span-3">
                <div className="relative">
                  {/* Progress line background */}
                  <div className="absolute left-5 top-6 bottom-6 w-px bg-neutral-800" />
                  
                  {/* Progress line fill */}
                  <div
                    ref={progressLineRef}
                    className="absolute left-5 top-6 bottom-6 w-px bg-accent-400 origin-top"
                    style={{ transform: 'scaleY(0)' }}
                  />

                  {/* Step indicators */}
                  <div className="relative">
                    {steps.map((step, idx) => (
                      <StepIndicator
                        key={step.id}
                        step={step}
                        index={idx}
                        isActive={idx === activeStep}
                        isComplete={idx < activeStep}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Content panels */}
              <div className="col-span-8 lg:col-span-9">
                <div ref={panelsRef} className="relative min-h-[450px]">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      data-step-panel
                      data-index={idx}
                      className={`
                        ${idx === 0 ? '' : 'absolute inset-0'}
                        grid grid-cols-1 lg:grid-cols-2 gap-8
                      `}
                      style={{ opacity: idx === 0 ? 1 : 0 }}
                    >
                      {/* Text content */}
                      <div className="flex flex-col justify-center">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400/70 mb-3">
                          Step {idx + 1}
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                          {step.title}
                        </h3>
                        <p className="text-neutral-400 leading-relaxed text-lg">
                          {step.body}
                        </p>
                      </div>

                      {/* Diagram panel */}
                      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 flex items-center justify-center">
                        {step.diagram}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div ref={mobileRef} className="md:hidden container-custom">
          {/* Header */}
          <div className="mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/80 mb-4">
              Our Process
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 word-spacing-wide">
              From discovery to validation.
            </h2>
            <p className="text-neutral-400">
              A proven methodology that de-risks automation projects.
            </p>
          </div>

          {/* Stacked steps */}
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                data-mobile-step
                className="border-l-2 border-accent-400/30 pl-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent-500/20 border border-accent-400/50 flex items-center justify-center text-sm font-bold text-accent-400">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-400">
                    {step.label}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  {step.body}
                </p>

                {/* Diagram */}
                <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 aspect-[4/3]">
                  {step.diagram}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Section>
  )
}

