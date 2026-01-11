import { notFound } from 'next/navigation'
import { getWorkBySlug, getWorkSlugs, extractHeadings } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import Link from 'next/link'
import { ReactNode } from 'react'

// Generate static paths for all work items
export async function generateStaticParams() {
  const slugs = getWorkSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const work = getWorkBySlug(params.slug)
  
  if (!work) {
    return { title: 'Not Found' }
  }
  
  return {
    title: `${work.frontmatter.title} | Vertex Assembly`,
    description: work.frontmatter.summary,
  }
}

// Inline Figure component
interface FigureProps {
  src?: string
  alt?: string
  caption?: string
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2'
}

function Figure({ 
  src, 
  alt = 'Project image', 
  caption, 
  aspectRatio = '16/9',
}: FigureProps) {
  const aspectClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
  }

  return (
    <figure className="my-12 md:my-16">
      <div className={`relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 ${aspectClasses[aspectRatio]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={src} 
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-600/20 via-primary-700/20 to-accent-500/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-neutral-500 font-medium">{alt}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-neutral-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Inline Callout component
interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'note'
  title?: string
  children: ReactNode
}

const calloutIcons = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  note: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
}

const calloutStyles = {
  info: {
    container: 'border-accent-500/30 bg-accent-950/20',
    icon: 'text-accent-400 bg-accent-500/20',
    title: 'text-accent-300',
  },
  warning: {
    container: 'border-amber-500/30 bg-amber-950/20',
    icon: 'text-amber-400 bg-amber-500/20',
    title: 'text-amber-300',
  },
  success: {
    container: 'border-emerald-500/30 bg-emerald-950/20',
    icon: 'text-emerald-400 bg-emerald-500/20',
    title: 'text-emerald-300',
  },
  note: {
    container: 'border-neutral-600/30 bg-neutral-900/50',
    icon: 'text-neutral-400 bg-neutral-700/50',
    title: 'text-neutral-200',
  },
}

function Callout({ type = 'note', title, children }: CalloutProps) {
  const style = calloutStyles[type]

  return (
    <div className={`my-8 rounded-lg border pl-4 pr-6 py-5 ${style.container}`}>
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${style.icon}`}>
          {calloutIcons[type]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold mb-2 ${style.title}`}>
              {title}
            </h4>
          )}
          <div className="text-neutral-300 text-sm leading-relaxed [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Tag color mapping
const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  Automation: { bg: 'bg-accent-500/10', text: 'text-accent-400', border: 'border-accent-500/30' },
  Vision: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Orchestration: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
}

const mdxComponents = {
  Figure,
  Callout,
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const work = getWorkBySlug(params.slug)
  
  if (!work) {
    notFound()
  }
  
  const headings = extractHeadings(work.content)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return (
    <article className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section pb-8 md:pb-12">
        <div className="container-custom">
          <div className="max-w-4xl">
            {/* Back link */}
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent-400 transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Work
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {work.frontmatter.tags.map((tag) => {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white word-spacing-wide">
              {work.frontmatter.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-8">
              <span>{formatDate(work.frontmatter.date)}</span>
              {work.frontmatter.client && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <span>Client: <span className="text-neutral-300">{work.frontmatter.client}</span></span>
                </>
              )}
            </div>

            {/* Summary */}
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
              {work.frontmatter.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Hero Image Placeholder */}
      <section className="mb-12 md:mb-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 via-primary-700/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-500 font-medium">Project Hero Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="section pt-0">
        <div className="container-custom">
          <div className="flex gap-12 lg:gap-20">
            {/* Sticky Side Navigation */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <nav className="sticky top-32">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                    On this page
                  </h3>
                  <ul className="space-y-1">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={`
                            block text-sm py-1.5 transition-colors duration-200
                            ${heading.level === 3 ? 'pl-4' : 'pl-0'}
                            text-neutral-400 hover:text-neutral-200
                          `}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}

            {/* Article Content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              <div className="prose prose-invert prose-lg max-w-none">
                <MDXRemote 
                  source={work.content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeSlug],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section border-t border-neutral-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to transform your operations?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our automation solutions can help you achieve similar results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary rounded-lg"
              >
                Start a Conversation
              </Link>
              <Link
                href="/work"
                className="btn-secondary rounded-lg"
              >
                View More Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
