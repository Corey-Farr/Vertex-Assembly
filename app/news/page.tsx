'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { revealOnScroll } from '@/lib/animations'

// This would typically come from MDX files
const newsItems = [
  {
    slug: 'new-robotic-system-launch',
    title: 'Next-Generation Robotic System Launch',
    date: '2024-03-15',
    excerpt: "We're excited to announce the launch of our latest robotic system, featuring advanced AI capabilities and improved precision.",
    category: 'Product',
  },
  {
    slug: 'industry-award-2024',
    title: 'Vertex Assembly Wins Industry Innovation Award',
    date: '2024-02-20',
    excerpt: 'Recognized for excellence in automation innovation at the annual Industrial Automation Awards.',
    category: 'Awards',
  },
  {
    slug: 'partnership-announcement',
    title: 'Strategic Partnership with Global Manufacturer',
    date: '2024-01-10',
    excerpt: 'New partnership to deliver integrated automation solutions across multiple manufacturing facilities.',
    category: 'Partnerships',
  },
  {
    slug: 'sustainability-initiative',
    title: 'Sustainability Initiative: Reducing Manufacturing Waste',
    date: '2023-12-05',
    excerpt: 'How our automation systems are helping clients reduce waste and improve sustainability metrics.',
    category: 'Sustainability',
  },
]

export default function NewsPage() {
  const titleRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      revealOnScroll(titleRef.current)
    }
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('.news-item')
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
              News & Updates
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Stay informed about our latest projects, innovations, and industry insights
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div ref={listRef} className="max-w-4xl mx-auto space-y-8">
            {newsItems.map((item, index) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="news-item opacity-0 block p-8 border border-neutral-800 rounded-lg bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <time className="text-sm text-neutral-500">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white hover:text-accent-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-neutral-400 leading-relaxed">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

