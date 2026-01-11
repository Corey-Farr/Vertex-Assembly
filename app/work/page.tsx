'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Work data - in production this comes from MDX, but for client component we pre-fetch
interface WorkItem {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
}

const workItems: WorkItem[] = [
  {
    slug: 'automotive-assembly',
    title: 'Automotive Assembly Line',
    date: '2024-08-15',
    tags: ['Automation', 'Vision'],
    summary: 'Complete transformation of a 50,000 sq ft production facility with 200+ robotic units, achieving 300% increased capacity.',
  },
  {
    slug: 'pharmaceutical-packaging',
    title: 'Pharmaceutical Packaging',
    date: '2024-05-22',
    tags: ['Automation', 'Orchestration'],
    summary: 'Sterile environment automation with 99.9% accuracy in high-volume packaging operations for a leading pharmaceutical company.',
  },
  {
    slug: 'electronics-manufacturing',
    title: 'Electronics Manufacturing',
    date: '2024-03-10',
    tags: ['Vision', 'Automation'],
    summary: 'Precision assembly systems handling micro-components with sub-millimeter accuracy for high-volume consumer electronics.',
  },
  {
    slug: 'warehouse-orchestration',
    title: 'Warehouse Orchestration System',
    date: '2024-01-18',
    tags: ['Orchestration', 'Automation'],
    summary: 'End-to-end warehouse automation orchestrating 150+ AGVs, robotic picking stations, and automated storage systems.',
  },
  {
    slug: 'vision-quality-system',
    title: 'AI Vision Quality System',
    date: '2023-11-05',
    tags: ['Vision'],
    summary: 'Deep learning-powered visual inspection system achieving 99.97% defect detection across 50+ defect categories.',
  },
]

const filterOptions = ['All', 'Automation', 'Vision', 'Orchestration'] as const
type FilterOption = typeof filterOptions[number]

// Tag color mapping for visual variety
const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  Automation: { bg: 'bg-accent-500/10', text: 'text-accent-400', border: 'border-accent-500/30' },
  Vision: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Orchestration: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All')
  const [filteredWorks, setFilteredWorks] = useState(workItems)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const filterButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Initial page load animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Hero reveal
    if (heroRef.current) {
      tl.fromTo(
        heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      )
    }

    // Filters reveal
    if (filtersRef.current) {
      tl.fromTo(
        filtersRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      )
    }

    // Grid items stagger reveal
    if (gridRef.current) {
      const items = gridRef.current.querySelectorAll('.work-card')
      tl.fromTo(
        items,
        { opacity: 0, y: 60, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.1 
        },
        '-=0.3'
      )
    }

    return () => {
      tl.kill()
    }
  }, [])

  // Position the pill indicator on the active filter
  const updatePillPosition = useCallback((index: number) => {
    const button = filterButtonsRef.current[index]
    const pill = pillRef.current
    if (!button || !pill) return

    gsap.to(pill, {
      x: button.offsetLeft,
      width: button.offsetWidth,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [])

  // Initialize pill position
  useEffect(() => {
    const activeIndex = filterOptions.indexOf(activeFilter)
    updatePillPosition(activeIndex)
  }, [activeFilter, updatePillPosition])

  // Handle filter change with animation
  const handleFilterChange = useCallback((filter: FilterOption) => {
    if (filter === activeFilter || isAnimating) return
    
    setIsAnimating(true)
    setActiveFilter(filter)

    const newFiltered = filter === 'All' 
      ? workItems 
      : workItems.filter(item => item.tags.includes(filter))

    // Animate out current items
    if (gridRef.current) {
      const currentItems = gridRef.current.querySelectorAll('.work-card')
      
      gsap.to(currentItems, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          setFilteredWorks(newFiltered)
          
          // Animate in new items after React re-renders
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (gridRef.current) {
                const newItems = gridRef.current.querySelectorAll('.work-card')
                gsap.fromTo(
                  newItems,
                  { opacity: 0, y: 40, scale: 0.95 },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                    onComplete: () => setIsAnimating(false),
                  }
                )
              }
            })
          })
        },
      })
    }
  }, [activeFilter, isAnimating])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section pb-16 md:pb-20">
        <div className="container-custom">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center opacity-0">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase text-accent-400 bg-accent-500/10 border border-accent-500/20 rounded-full">
              Case Studies
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide">
              Our Work
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              Transformative automation solutions that redefine what&apos;s possible in manufacturing
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pb-12 md:pb-16">
        <div className="container-custom">
          <div ref={filtersRef} className="flex justify-center opacity-0">
            <div className="relative inline-flex p-1.5 bg-neutral-900/50 border border-neutral-800 rounded-full backdrop-blur-sm">
              {/* Animated pill background */}
              <div
                ref={pillRef}
                className="absolute top-1.5 left-0 h-[calc(100%-12px)] bg-accent-600 rounded-full transition-colors"
                style={{ width: 0 }}
              />
              
              {/* Filter buttons */}
              {filterOptions.map((filter, index) => (
                <button
                  key={filter}
                  ref={el => { filterButtonsRef.current[index] = el }}
                  onClick={() => handleFilterChange(filter)}
                  className={`
                    relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300
                    ${activeFilter === filter 
                      ? 'text-white' 
                      : 'text-neutral-400 hover:text-neutral-200'}
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section className="section pt-0">
        <div className="container-custom">
          <div 
            ref={gridRef} 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredWorks.map((work) => (
              <Link
                key={work.slug}
                href={`/work/${work.slug}`}
                className="work-card group relative block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/50 transition-all duration-500"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-600/5 via-transparent to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Image placeholder */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-primary-700/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-6 md:p-8 -mt-24">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.tags.map((tag) => {
                      const colors = tagColors[tag] || tagColors.Automation
                      return (
                        <span
                          key={tag}
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-accent-400 transition-colors duration-300">
                    {work.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                    {work.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                    <span className="text-sm text-neutral-500">
                      {formatDate(work.date)}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-medium text-accent-400 group-hover:text-accent-300 transition-colors">
                      View Case Study
                      <svg 
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredWorks.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-neutral-400">
                No case studies match the selected filter. Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
