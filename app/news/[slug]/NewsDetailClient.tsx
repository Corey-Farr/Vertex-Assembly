'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

interface NewsDetailProps {
  news: {
    title: string
    date: string
    category: string
    summary?: string
    author?: string
    readTime?: string
    content: string
  }
}

// Category colors
const categoryColors: Record<string, string> = {
  Product: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  Awards: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Partnerships: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Sustainability: 'text-green-400 bg-green-500/10 border-green-500/20',
  Technology: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
}

// Simple markdown renderer with better styling
function MarkdownContent({ content }: { content: string }) {
  const lines = content.trim().split('\n')
  const elements: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === '') {
      i++
      continue
    }

    // H1 (skip - title is in hero)
    if (line.startsWith('# ')) {
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-2xl md:text-3xl font-bold mb-4 mt-12 text-white first:mt-0"
        >
          {line.substring(3)}
        </h2>
      )
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl md:text-2xl font-semibold mb-3 mt-8 text-white">
          {line.substring(4)}
        </h3>
      )
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i].startsWith('>'))) {
        const quoteLine = lines[i].replace(/^>\s?/, '')
        if (quoteLine.trim()) quoteLines.push(quoteLine)
        i++
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-accent-500/50 pl-6 py-2 my-8 italic text-neutral-300"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="mb-2 last:mb-0">
              {ql}
            </p>
          ))}
        </blockquote>
      )
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].substring(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 mb-6 ml-4">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2.5 flex-shrink-0" />
              <span
                dangerouslySetInnerHTML={{
                  __html: item
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>'),
                }}
              />
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const headers = line
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean)
      i += 2 // Skip header and separator

      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i]
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean)
        rows.push(cells)
        i++
      }

      elements.push(
        <div key={`table-${i}`} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-700">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="py-3 px-4 text-left text-sm font-semibold text-white"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-neutral-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-3 px-4 text-sm text-neutral-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Paragraph
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('-') &&
      !lines[i].startsWith('>') &&
      !lines[i].includes('|')
    ) {
      paragraphLines.push(lines[i])
      i++
    }

    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ')
      elements.push(
        <p
          key={`p-${i}`}
          className="mb-6 text-neutral-300 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{
            __html: text
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>'),
          }}
        />
      )
    }
  }

  return <div className="content-prose">{elements}</div>
}

export default function NewsDetailClient({ news }: NewsDetailProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)

  const [readProgress, setReadProgress] = useState(0)

  // Reading progress bar
  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const handleScroll = () => {
      const articleRect = article.getBoundingClientRect()
      const articleStart = window.scrollY + articleRect.top
      const articleHeight = articleRect.height
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate progress: 0 at top of article, 100 at bottom
      const progress = Math.min(
        100,
        Math.max(0, ((scrollY - articleStart + windowHeight * 0.3) / articleHeight) * 100)
      )
      setReadProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hero animations
  useEffect(() => {
    const hero = heroRef.current
    const title = titleRef.current
    const content = contentRef.current

    if (!hero || !title) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      await ensureScrollTrigger()
      if (killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        // Title animation
        if (!isReduced) {
          const { elements, restore } = applySplitText(title, 'words', 'news-title')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 40 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.04,
            delay: 0.2,
            ease: 'power3.out',
          })
        }

        // Content fade in
        if (content) {
          if (isReduced) {
            gsap.set(content, { opacity: 1, y: 0 })
          } else {
            gsap.fromTo(
              content,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
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

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-800 z-50">
        <div
          ref={progressRef}
          className="h-full bg-accent-500 transition-all duration-100 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="pt-20">
        {/* Hero */}
        <section ref={heroRef} className="section relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[40rem] bg-accent-500/20 rounded-full blur-[150px]" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Back link */}
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Back to News</span>
              </Link>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                    categoryColors[news.category] || 'text-neutral-400 bg-neutral-800 border-neutral-700'
                  }`}
                >
                  {news.category}
                </span>
                <time className="text-sm text-neutral-500">
                  {new Date(news.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {news.readTime && (
                  <span className="text-sm text-neutral-500">• {news.readTime}</span>
                )}
              </div>

              {/* Title */}
              <h1
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 word-spacing-wide leading-tight"
              >
                {news.title}
              </h1>

              {/* Author */}
              {news.author && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <span className="text-neutral-400">By {news.author}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <article ref={articleRef} className="pb-24 md:pb-32">
          <div className="container-custom">
            <div ref={contentRef} className="max-w-3xl mx-auto opacity-0">
              <MarkdownContent content={news.content} />
            </div>
          </div>
        </article>

        {/* Footer CTA */}
        <section className="py-16 border-t border-neutral-800">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Interested in learning more?
                </h3>
                <p className="text-neutral-400">
                  Get in touch to discuss how we can help your operation.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-colors duration-300 whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

