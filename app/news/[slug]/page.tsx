import { notFound } from 'next/navigation'
import NewsDetail from '@/components/news/NewsDetail'

// In a real app, this would read from MDX files
const newsData: Record<string, any> = {
  'new-robotic-system-launch': {
    title: 'Next-Generation Robotic System Launch',
    date: '2024-03-15',
    category: 'Product',
    content: `
# Next-Generation Robotic System Launch

We're excited to announce the launch of our latest robotic system, featuring advanced AI capabilities and improved precision.

## Key Features

- **Advanced AI Integration**: Machine learning algorithms for adaptive behavior
- **Enhanced Precision**: Sub-millimeter accuracy for delicate operations
- **Improved Speed**: 30% faster cycle times compared to previous models
- **Better Connectivity**: Seamless integration with existing production systems

## Impact

This new system represents a significant leap forward in industrial automation, enabling manufacturers to achieve new levels of efficiency and quality.

## Availability

The system is now available for order, with delivery starting in Q2 2024.
    `,
  },
  'industry-award-2024': {
    title: 'Vertex Assembly Wins Industry Innovation Award',
    date: '2024-02-20',
    category: 'Awards',
    content: `
# Industry Innovation Award 2024

Vertex Assembly has been recognized for excellence in automation innovation at the annual Industrial Automation Awards.

## Recognition

We're honored to receive this award for our groundbreaking work in developing integrated automation solutions that have transformed manufacturing operations across multiple industries.

## What This Means

This recognition reflects our commitment to innovation and excellence in everything we do. We're grateful to our team, partners, and clients who made this possible.
    `,
  },
  'partnership-announcement': {
    title: 'Strategic Partnership with Global Manufacturer',
    date: '2024-01-10',
    category: 'Partnerships',
    content: `
# Strategic Partnership Announcement

We're pleased to announce a new strategic partnership with a leading global manufacturer to deliver integrated automation solutions.

## Partnership Details

This partnership will enable us to deliver comprehensive automation solutions across multiple manufacturing facilities, combining our technical expertise with their operational scale.

## Benefits

- Expanded service capabilities
- Enhanced support network
- Accelerated innovation
- Better customer outcomes
    `,
  },
  'sustainability-initiative': {
    title: 'Sustainability Initiative: Reducing Manufacturing Waste',
    date: '2023-12-05',
    category: 'Sustainability',
    content: `
# Sustainability in Manufacturing

How our automation systems are helping clients reduce waste and improve sustainability metrics.

## The Challenge

Manufacturing operations generate significant waste, both in materials and energy consumption.

## Our Solution

Our automation systems are designed with sustainability in mind:

- Optimized material usage
- Energy-efficient operations
- Reduced waste through precision
- Data-driven optimization

## Results

Clients using our systems have reported:
- 25% reduction in material waste
- 15% decrease in energy consumption
- Improved sustainability metrics
    `,
  },
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = newsData[params.slug]

  if (!news) {
    notFound()
  }

  return <NewsDetail news={news} />
}

