# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

```
vertex-assembly/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles + Tailwind
│   ├── solutions/           # Solutions page
│   ├── work/                # Work listing & detail pages
│   ├── about/               # About page
│   ├── news/                # News listing & detail pages
│   └── contact/             # Contact page
├── components/
│   ├── layout/              # Global layout components
│   │   ├── GlobalLayout.tsx
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx
│   ├── home/                # Home page sections
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── SolutionsPreview.tsx
│   │   ├── WorkPreview.tsx
│   │   └── CTA.tsx
│   ├── work/                # Work detail components
│   └── news/                # News detail components
├── lib/
│   ├── animations.ts        # GSAP animation utilities
│   ├── smooth-scroll.ts     # Lenis smooth scroll
│   └── mdx.ts               # MDX file reading utilities
├── content/                 # MDX content files
│   ├── work/                # Work case studies
│   └── news/                # News posts
└── public/                  # Static assets
```

## Key Features Implemented

✅ **Next.js 14 App Router** with TypeScript  
✅ **Tailwind CSS** with custom design system  
✅ **GSAP + ScrollTrigger** animations  
✅ **Lenis** smooth scrolling  
✅ **Page transitions** (fade + translate)  
✅ **Responsive design** (mobile → desktop)  
✅ **Accessibility** (ARIA labels, focus states, reduced motion)  
✅ **MDX content** system (file-based)  
✅ **Performance optimizations**  

## Customization Points

### Animation Timings
- **Hero text reveal**: `lib/animations.ts` - `revealText()` function
- **Scroll reveals**: Component files - `revealOnScroll()` calls
- **Page transitions**: `components/layout/PageTransition.tsx`

### Design System
- **Colors**: `tailwind.config.ts` - `colors` section
- **Typography**: `tailwind.config.ts` - `fontSize` section
- **Spacing**: `tailwind.config.ts` - `spacing` section

### Content
- **Work case studies**: Add `.mdx` files to `content/work/`
- **News posts**: Add `.mdx` files to `content/news/`

## Notes

- All animations respect `prefers-reduced-motion`
- GSAP animations only run on client-side
- Smooth scrolling is disabled for users with reduced motion preference
- The project uses placeholder gradients instead of external images
- MDX files use frontmatter for metadata

## Next Steps

1. Add real images to replace gradient placeholders
2. Customize content in MDX files
3. Adjust animation timings to your preference
4. Add WebGL hero (optional) using react-three-fiber
5. Deploy to Vercel or your preferred hosting

