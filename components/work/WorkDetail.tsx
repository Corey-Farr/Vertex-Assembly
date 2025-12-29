'use client'

import { useEffect, useRef } from 'react'
import { revealOnScroll } from '@/lib/animations'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

// Simple markdown renderer (in production, use proper MDX)
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentParagraph: string[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('# ')) {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4 text-neutral-300">{currentParagraph.join(' ')}</p>)
        currentParagraph = []
      }
      elements.push(<h2 key={`h2-${index}`} className="text-3xl font-bold mb-4 mt-8 text-white">{line.substring(2)}</h2>)
    } else if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4 text-neutral-300">{currentParagraph.join(' ')}</p>)
        currentParagraph = []
      }
      elements.push(<h3 key={`h3-${index}`} className="text-2xl font-semibold mb-3 mt-6 text-white">{line.substring(3)}</h3>)
    } else if (line.startsWith('- ')) {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4 text-neutral-300">{currentParagraph.join(' ')}</p>)
        currentParagraph = []
      }
      const listItems = [line.substring(2)]
      let nextIndex = index + 1
      while (nextIndex < lines.length && lines[nextIndex].startsWith('- ')) {
        listItems.push(lines[nextIndex].substring(2))
        nextIndex++
      }
      elements.push(
        <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2 text-neutral-300 ml-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    } else if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4 text-neutral-300">{currentParagraph.join(' ')}</p>)
        currentParagraph = []
      }
    } else {
      currentParagraph.push(line.trim())
    }
  })

  if (currentParagraph.length > 0) {
    elements.push(<p key="p-final" className="mb-4 text-neutral-300">{currentParagraph.join(' ')}</p>)
  }

  return <div>{elements}</div>
}

export default function WorkDetail({ work }: { work: any }) {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heroRef.current) {
      revealOnScroll(heroRef.current)
    }
    if (contentRef.current) {
      revealOnScroll(contentRef.current)
    }
  }, [])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="section opacity-0">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">
                {work.category}
              </span>
              <span className="text-sm text-neutral-500 ml-4">{work.year}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide">
              {work.title}
            </h1>
            {work.client && (
              <p className="text-lg text-neutral-400 mb-4">
                Client: <span className="text-neutral-300">{work.client}</span>
              </p>
            )}
            <p className="text-xl text-neutral-300 leading-relaxed">
              {work.description}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="mb-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="h-96 bg-gradient-to-br from-accent-600/20 to-primary-600/20 rounded-lg border border-neutral-800 flex items-center justify-center">
              <span className="text-neutral-500 text-sm">Project Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="section opacity-0">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <div className="text-neutral-300 leading-relaxed">
              <MarkdownContent content={work.content} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

