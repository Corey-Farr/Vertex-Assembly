# Vertex Assembly - Premium Robotics Portfolio Website

A high-end, animation-forward portfolio website for Vertex Assembly (Robotics & Automated Production Systems). Built with Next.js 14, TypeScript, Tailwind CSS, GSAP, and Lenis smooth scrolling.

## Features

- **Premium Industrial Design**: Minimal, precise typography with dark mode-first aesthetic
- **Cinematic Animations**: GSAP + ScrollTrigger for scroll-driven transitions
- **Smooth Scrolling**: Lenis integrated with GSAP ticker
- **Responsive Design**: Mobile-first approach with full desktop experience
- **Accessibility**: Respects `prefers-reduced-motion`, semantic HTML, ARIA labels
- **Performance**: Code-split, lazy-loaded assets, optimized for Lighthouse
- **MDX Content**: File-based content system for work case studies and news posts

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis (@studio-freight/lenis)
- **3D (Optional)**: react-three-fiber + drei
- **Content**: MDX with file-based system

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── solutions/         # Solutions page
│   ├── work/              # Work listing and detail pages
│   ├── about/             # About page
│   ├── news/              # News listing and detail pages
│   └── contact/           # Contact page
├── components/            # React components
│   ├── layout/            # Global layout components (Nav, Footer)
│   ├── home/              # Home page sections
│   ├── work/              # Work detail components
│   └── news/              # News detail components
├── lib/                   # Utilities and helpers
│   ├── animations.ts      # GSAP animation utilities
│   ├── smooth-scroll.ts   # Lenis smooth scroll setup
│   └── mdx.ts             # MDX file reading utilities
├── content/               # MDX content files
│   ├── work/              # Work case studies (.mdx)
│   └── news/              # News posts (.mdx)
└── public/                # Static assets
```

## Animation Utilities

The project includes reusable animation utilities in `lib/animations.ts`:

- **`revealText()`**: Reveal text with word or line stagger
- **`revealOnScroll()`**: Reveal elements on scroll with ScrollTrigger
- **`parallax()`**: Parallax scrolling effects
- **`countUp()`**: Animated number counting
- **`fadeIn()`**: Simple fade-in animation

All animations respect `prefers-reduced-motion` and are disabled for users who prefer reduced motion.

### Customizing Animations

Animation timings and offsets can be adjusted in the component files. Look for comments like:

```typescript
// Tweak these values for different reveal timings
revealOnScroll(element, {
  start: 'top 80%',  // Animation starts when element is 80% from top
  delay: 0.1,         // Delay in seconds
})
```

## Content Management

### Adding Work Case Studies

1. Create a new `.mdx` file in `content/work/`
2. Add frontmatter:

```mdx
---
title: 'Project Title'
category: 'Category'
year: '2024'
client: 'Client Name'
description: 'Brief description'
---

# Your content here
```

3. The file will automatically appear in `/work` and be accessible at `/work/[filename]`

### Adding News Posts

1. Create a new `.mdx` file in `content/news/`
2. Add frontmatter:

```mdx
---
title: 'News Title'
date: '2024-03-15'
category: 'Category'
---

# Your content here
```

3. The file will automatically appear in `/news` and be accessible at `/news/[filename]`

## Design System

### Colors

- **Primary**: Neutral grays (950-50)
- **Accent**: Blue tones (400-600)
- **Background**: Dark mode-first (neutral-950)

### Typography

- **Font**: Inter (via Next.js font optimization)
- **Scale**: Responsive type scale from xs to 9xl
- **Tracking**: Tighter letter spacing for larger sizes

### Spacing

- **Sections**: `py-24 md:py-32 lg:py-40`
- **Container**: `max-w-8xl` with responsive padding

## Performance Optimizations

- Code splitting via Next.js App Router
- Lazy loading of heavy assets
- GSAP animations only load on client
- Respects `prefers-reduced-motion`
- Optimized font loading
- Image optimization ready (when images are added)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Reduced motion support for accessibility
