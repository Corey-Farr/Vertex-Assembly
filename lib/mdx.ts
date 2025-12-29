import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

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
export function getMdxData(dir: string, slug: string) {
  const fullPath = path.join(contentDirectory, dir, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    slug,
    frontmatter: data as Record<string, any>,
    content,
  }
}

/**
 * Get all MDX files with their data from a directory
 * @param dir - Directory name within content/
 */
export function getAllMdxData(dir: string) {
  const files = getMdxFiles(dir)
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return getMdxData(dir, slug)
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

