import { notFound } from 'next/navigation'
import WorkDetail from '@/components/work/WorkDetail'

// In a real app, this would read from MDX files
// For now, we'll use placeholder data
const workData: Record<string, any> = {
  'automotive-assembly': {
    title: 'Automotive Assembly Line',
    category: 'Manufacturing',
    year: '2024',
    client: 'Major Automotive Manufacturer',
    description: 'Complete transformation of a 50,000 sq ft production facility with 200+ robotic units.',
    content: `
# Automotive Assembly Line Transformation

## Overview

This project involved the complete automation of a state-of-the-art automotive assembly facility, integrating over 200 robotic units across multiple production lines.

## Challenge

The client needed to increase production capacity by 300% while maintaining the highest quality standards and reducing operational costs.

## Solution

We designed and implemented a fully integrated automation system featuring:

- **Robotic Assembly Cells**: 50 precision assembly stations
- **Material Handling**: Automated conveyor systems with AGV integration
- **Quality Control**: AI-powered vision inspection at every stage
- **Data Integration**: Real-time monitoring and analytics dashboard

## Results

- **300% increase** in production capacity
- **40% reduction** in operational costs
- **99.8% quality** rate achieved
- **Zero downtime** during implementation phase
    `,
  },
  'pharmaceutical-packaging': {
    title: 'Pharmaceutical Packaging',
    category: 'Healthcare',
    year: '2023',
    client: 'Leading Pharma Company',
    description: 'Sterile environment automation with 99.9% accuracy in high-volume packaging operations.',
    content: `
# Pharmaceutical Packaging Automation

## Overview

A complete sterile environment automation system for high-volume pharmaceutical packaging operations.

## Challenge

Maintaining sterile conditions while achieving high-speed packaging with absolute accuracy.

## Solution

- Cleanroom-compliant robotic systems
- Vision-guided precision placement
- Automated quality verification
- Integrated traceability systems

## Results

- **99.9% accuracy** rate
- **5x throughput** increase
- **Zero contamination** incidents
- **Full regulatory compliance**
    `,
  },
  'electronics-manufacturing': {
    title: 'Electronics Manufacturing',
    category: 'Technology',
    year: '2023',
    client: 'Electronics Manufacturer',
    description: 'Precision assembly systems handling micro-components with sub-millimeter accuracy.',
    content: `
# Electronics Manufacturing Precision

## Overview

Precision assembly systems for micro-electronic components requiring sub-millimeter accuracy.

## Challenge

Handling components smaller than 1mm with consistent precision at high volumes.

## Solution

- Micro-precision robotic arms
- Advanced vision systems
- Vibration isolation platforms
- Real-time quality monitoring

## Results

- **Sub-millimeter accuracy** achieved
- **200% production increase**
- **Defect rate below 0.01%**
    `,
  },
  'food-processing': {
    title: 'Food Processing Automation',
    category: 'Food & Beverage',
    year: '2022',
    client: 'Food Processing Company',
    description: 'Hygienic automation systems for high-speed food processing and packaging.',
    content: `
# Food Processing Automation

## Overview

Hygienic automation systems designed for high-speed food processing and packaging operations.

## Challenge

Maintaining food safety standards while maximizing throughput in a cost-effective manner.

## Solution

- Food-grade compliant systems
- Automated cleaning protocols
- High-speed packaging lines
- Integrated quality control

## Results

- **4x throughput** increase
- **100% food safety** compliance
- **30% cost reduction**
    `,
  },
}

export default function WorkDetailPage({ params }: { params: { slug: string } }) {
  const work = workData[params.slug]

  if (!work) {
    notFound()
  }

  return <WorkDetail work={work} />
}

