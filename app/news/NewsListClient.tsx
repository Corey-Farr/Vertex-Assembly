'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'
import type { NewsFrontmatter } from '@/lib/mdx'

interface NewsItem {
  slug: string
  frontmatter: NewsFrontmatter
  content: string
}

interface NewsListClientProps {
  news: NewsItem[]
}

// Category colors
const categoryColors: Record<string, string> = {
  Product: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  Awards: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Partnerships: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Sustainability: 'text-green-400 bg-green-500/10 border-green-500/20',
  Technology: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
}

export default function NewsListClient({ news }: NewsListClientProps) {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(news.map((item) => item.frontmatter.category)))

  // Filter news
  const filteredNews = filter
    ? news.filter((item) => item.frontmatter.category === filter)
    : news

  // Hero animations
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
          const { elements, restore } = applySplitText(headline, 'words', 'news-hero')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 50, rotateX: -20 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.06,
            delay: 0.15,
            ease: 'power3.out',
          })
        }

        if (subhead) {
          if (isReduced) {
            gsap.set(subhead, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              subhead,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power2.out' }
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

  // List items reveal animation
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      const items = list.querySelectorAll('.news-item')

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: list,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }, list)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [filteredNews])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 right-1/4 w-[50rem] h-[50rem] bg-accent-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              Latest Updates
            </div>
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide"
              style={{ perspective: '1000px' }}
            >
              News & Insights
            </h1>
            <p
              ref={subheadRef}
              className="text-xl text-neutral-400 leading-relaxed opacity-0"
            >
              Stay informed about our latest projects, innovations, and industry insights
            </p>
          </div>
        </div>
      </section>

      {/* Filter + News List */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === null
                  ? 'bg-accent-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-accent-500 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News grid */}
          <div ref={listRef} className="max-w-5xl mx-auto grid gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="news-item group block p-6 md:p-8 border border-neutral-800 rounded-2xl bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                        categoryColors[item.frontmatter.category] || 'text-neutral-400 bg-neutral-800 border-neutral-700'
                      }`}
                    >
                      {item.frontmatter.category}
                    </span>
                    {item.frontmatter.readTime && (
                      <span className="text-xs text-neutral-500">
                        {item.frontmatter.readTime}
                      </span>
                    )}
                  </div>
                  <time className="text-sm text-neutral-500">
                    {new Date(item.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-accent-400 transition-colors duration-300">
                  {item.frontmatter.title}
                </h2>

                <p className="text-neutral-400 leading-relaxed mb-4">
                  {item.frontmatter.summary}
                </p>

                <div className="flex items-center text-accent-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  <span>Read article</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

