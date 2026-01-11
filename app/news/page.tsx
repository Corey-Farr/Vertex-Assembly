import { getAllNews } from '@/lib/mdx'
import NewsListClient from './NewsListClient'

export const metadata = {
  title: 'News & Updates | Vertex Assembly',
  description: 'Stay informed about our latest projects, innovations, and industry insights in industrial automation.',
}

export default function NewsPage() {
  const news = getAllNews()
  
  return <NewsListClient news={news} />
}
