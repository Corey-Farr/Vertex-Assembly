import { notFound } from 'next/navigation'
import { getNewsBySlug, getNewsSlugs } from '@/lib/mdx'
import NewsDetailClient from './NewsDetailClient'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const news = getNewsBySlug(params.slug)
  
  if (!news) {
    return { title: 'Not Found' }
  }

  return {
    title: `${news.frontmatter.title} | Vertex Assembly`,
    description: news.frontmatter.summary,
  }
}

export default function NewsDetailPage({ params }: PageProps) {
  const news = getNewsBySlug(params.slug)

  if (!news) {
    notFound()
  }

  return (
    <NewsDetailClient
      news={{
        title: news.frontmatter.title,
        date: news.frontmatter.date,
        category: news.frontmatter.category,
        summary: news.frontmatter.summary,
        author: news.frontmatter.author,
        readTime: news.frontmatter.readTime,
        content: news.content,
      }}
    />
  )
}
