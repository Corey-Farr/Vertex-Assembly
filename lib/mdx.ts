import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface WorkFrontmatter {
  title: string
  date: string
  tags: string[]
  summary: string
  client?: string
  heroImage?: string
}

export interface NewsFrontmatter {
  title: string
  date: string
  summary: string
  category: string
  author?: string
  readTime?: string
}

export interface Heading {
  id: string
  text: string
  level: number
}

/**
 * Get all MDX files from a directory
 * @param dir - Directory name within content/ (e.g., 'work', 'news')
 */
export function getMdxFiles(dir: string): string[] {
  const fullPath = path.join(contentDirectory, dir)
  if (!fs.existsSync(fullPath)) {
    return []
  }
  return fs.readdirSync(fullPath).filter((file) => file.endsWith('.mdx'))
}

/**
 * Get MDX file data with frontmatter
 * @param dir - Directory name within content/
 * @param slug - File name without .mdx extension
 */
export function getMdxData<T = Record<string, any>>(dir: string, slug: string) {
  const fullPath = path.join(contentDirectory, dir, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    slug,
    frontmatter: data as T,
    content,
  }
}

/**
 * Get all MDX files with their data from a directory
 * @param dir - Directory name within content/
 */
export function getAllMdxData<T = Record<string, any>>(dir: string) {
  const files = getMdxFiles(dir)
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return getMdxData<T>(dir, slug)
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

/**
 * Get all work items with frontmatter
 */
export function getAllWork() {
  return getAllMdxData<WorkFrontmatter>('work').sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

/**
 * Get a single work item by slug
 */
export function getWorkBySlug(slug: string) {
  return getMdxData<WorkFrontmatter>('work', slug)
}

/**
 * Extract headings from MDX content for table of contents
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    // Create slug from heading text
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    headings.push({ id, text, level })
  }

  return headings
}

/**
 * Get all unique tags from work items
 */
export function getAllWorkTags(): string[] {
  const works = getAllWork()
  const tagsSet = new Set<string>()
  
  works.forEach(work => {
    work.frontmatter.tags?.forEach(tag => tagsSet.add(tag))
  })
  
  return Array.from(tagsSet).sort()
}

/**
 * Get static paths for work pages
 */
export function getWorkSlugs(): string[] {
  return getMdxFiles('work').map(file => file.replace(/\.mdx$/, ''))
}

/**
 * Get all news items with frontmatter
 */
export function getAllNews() {
  return getAllMdxData<NewsFrontmatter>('news').sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

/**
 * Get a single news item by slug
 */
export function getNewsBySlug(slug: string) {
  return getMdxData<NewsFrontmatter>('news', slug)
}

/**
 * Get static paths for news pages
 */
export function getNewsSlugs(): string[] {
  return getMdxFiles('news').map(file => file.replace(/\.mdx$/, ''))
}

/**
 * Get all unique categories from news items
 */
export function getAllNewsCategories(): string[] {
  const news = getAllNews()
  const categoriesSet = new Set<string>()
  
  news.forEach(item => {
    if (item.frontmatter.category) {
      categoriesSet.add(item.frontmatter.category)
    }
  })
  
  return Array.from(categoriesSet).sort()
}
