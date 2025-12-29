import type { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://vertexassembly.com'),
  title: {
    default: 'Vertex Assembly | Robotics & Automated Production Systems',
    template: '%s | Vertex Assembly',
  },
  description: 'Premium robotics and automated production systems for the future of manufacturing.',
  keywords: ['robotics', 'automation', 'manufacturing', 'industrial', 'production systems'],
  authors: [{ name: 'Vertex Assembly' }],
  creator: 'Vertex Assembly',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vertexassembly.com',
    siteName: 'Vertex Assembly',
    title: 'Vertex Assembly | Robotics & Automated Production Systems',
    description: 'Premium robotics and automated production systems for the future of manufacturing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vertex Assembly | Robotics & Automated Production Systems',
    description: 'Premium robotics and automated production systems for the future of manufacturing.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

