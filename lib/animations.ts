import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Animation utilities for Vertex Assembly
 * All animations respect prefers-reduced-motion
 */

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reveal text with line or word stagger
 * @param element - Target element or selector
 * @param options - Animation options
 */
export const revealText = (
  element: string | Element,
  options: {
    type?: 'line' | 'word'
    delay?: number
    duration?: number
    stagger?: number
    ease?: string
  } = {}
) => {
  if (prefersReducedMotion()) return

  const {
    type = 'word',
    delay = 0,
    duration = 0.8,
    stagger = 0.05,
    ease = 'power3.out',
  } = options

  const targets = gsap.utils.toArray(element)

  targets.forEach((target) => {
    if (type === 'word') {
      const words = (target as HTMLElement).textContent?.split(/\s+/).filter(w => w.length > 0) || []
      const spans = words.map((word) => {
        const span = document.createElement('span')
        span.textContent = word
        span.style.display = 'inline-block'
        span.style.opacity = '0'
        span.style.transform = 'translateY(100%)'
        return span
      })

      ;(target as HTMLElement).innerHTML = ''
      // Append spans with visible space spans between them
      spans.forEach((span, index) => {
        ;(target as HTMLElement).appendChild(span)
        // Add a space span after each word (except the last)
        if (index < spans.length - 1) {
          const spaceSpan = document.createElement('span')
          spaceSpan.innerHTML = '&nbsp;'
          spaceSpan.style.display = 'inline-block'
          spaceSpan.style.width = '0.3em'
          ;(target as HTMLElement).appendChild(spaceSpan)
        }
      })

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease,
      })
    } else {
      // Line-based reveal
      const lines = (target as HTMLElement).innerHTML.split('\n').filter(Boolean)
      const lineSpans = lines.map((line) => {
        const span = document.createElement('div')
        span.innerHTML = line
        span.style.opacity = '0'
        span.style.transform = 'translateY(30px)'
        return span
      })

      ;(target as HTMLElement).innerHTML = ''
      lineSpans.forEach((span) => (target as HTMLElement).appendChild(span))

      gsap.to(lineSpans, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease,
      })
    }
  })
}

/**
 * Reveal element on scroll
 * @param element - Target element or selector
 * @param options - ScrollTrigger options
 */
export const revealOnScroll = (
  element: string | Element,
  options: {
    start?: string
    end?: string
    scrub?: boolean | number
    once?: boolean
    markers?: boolean
    delay?: number
  } = {}
) => {
  if (prefersReducedMotion()) {
    // Still show elements, just without animation
    gsap.set(element, { opacity: 1, y: 0 })
    return
  }

  const {
    start = 'top 80%',
    end = 'top 20%',
    scrub = false,
    once = true,
    markers = false,
  } = options

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        once,
        markers,
        // Tweak these values for different reveal timings
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    }
  )
}

/**
 * Parallax effect on scroll
 * @param element - Target element or selector
 * @param options - Parallax options
 */
export const parallax = (
  element: string | Element,
  options: {
    speed?: number
    start?: string
    end?: string
  } = {}
) => {
  if (prefersReducedMotion()) return

  const { speed = 0.5, start = 'top bottom', end = 'bottom top' } = options

  gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,
    },
  })
}

/**
 * Count up animation
 * @param element - Target element or selector
 * @param options - Count options
 */
export const countUp = (
  element: string | Element,
  options: {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    start?: string
  } = { end: 0 }
) => {
  if (prefersReducedMotion()) {
    const { end, prefix = '', suffix = '' } = options
    const elements = gsap.utils.toArray(element) as HTMLElement[]
    elements.forEach((el) => {
      el.textContent = `${prefix}${end}${suffix}`
    })
    return
  }

  const {
    end,
    duration = 2,
    prefix = '',
    suffix = '',
    decimals = 0,
    start = 'top 80%',
  } = options

  const elements = gsap.utils.toArray(element) as HTMLElement[]

  elements.forEach((el) => {
    const obj = { count: 0 }
    const decimalsMultiplier = Math.pow(10, decimals)

    gsap.to(obj, {
      count: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
      onUpdate: () => {
        const value = Math.round(obj.count * decimalsMultiplier) / decimalsMultiplier
        el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      },
    })
  })
}

/**
 * Fade in on mount
 * @param element - Target element or selector
 */
export const fadeIn = (element: string | Element, delay = 0) => {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 })
    return
  }

  gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'power2.out',
    }
  )
}

