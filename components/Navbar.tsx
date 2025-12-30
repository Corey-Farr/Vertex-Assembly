'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, motionDuration, prefersReducedMotion } from '@/lib/gsap'
import clsx from 'clsx'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuTlRef = useRef<gsap.core.Timeline | null>(null)

  const activeMap = useMemo(() => {
    const map = new Map<string, boolean>()
    navItems.forEach((i) => map.set(i.href, isActive(i.href, pathname)))
    return map
  }, [pathname])

  // Close menu on route changes.
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Initial mount animation (lightweight).
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.va-nav-item',
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: motionDuration(0.5),
          stagger: 0.08,
          ease: 'power2.out',
        }
      )
    }, navRef)

    return () => ctx.revert()
  }, [])

  // Mobile menu slide-down animation (open/close).
  useEffect(() => {
    const menu = mobileMenuRef.current
    if (!menu) return

    menuTlRef.current?.kill()
    menuTlRef.current = null

    if (prefersReducedMotion()) {
      gsap.set(menu, { clearProps: 'all' })
      if (isOpen) {
        gsap.set(menu, { display: 'block', height: 'auto', opacity: 1 })
      } else {
        gsap.set(menu, { display: 'none', height: 0, opacity: 0 })
      }
      return
    }

    if (isOpen) {
      gsap.set(menu, { display: 'block' })
      const links = menu.querySelectorAll('a')
      const tl = gsap.timeline()
      tl.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: motionDuration(0.32), ease: 'power2.out' }
      ).fromTo(
        links,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: motionDuration(0.22), stagger: 0.05, ease: 'power2.out' },
        '-=0.16'
      )
      menuTlRef.current = tl
    } else {
      const tl = gsap.timeline({
        onComplete: () => gsap.set(menu, { display: 'none' }),
      })
      tl.to(menu, {
        height: 0,
        opacity: 0,
        duration: motionDuration(0.22),
        ease: 'power2.inOut',
      })
      menuTlRef.current = tl
    }
  }, [isOpen])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="va-nav-item text-2xl font-bold tracking-tight text-white"
            aria-label="Vertex Assembly Home"
          >
            <span className="text-accent-400">V</span>ERTEX
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = activeMap.get(item.href) === true
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'va-nav-item text-sm font-medium tracking-wide transition-colors',
                    active ? 'text-accent-400' : 'text-neutral-400 hover:text-neutral-100'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden va-nav-item text-neutral-400 hover:text-neutral-100 transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="va-mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu (animated) */}
        <div
          id="va-mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden border-t border-neutral-800"
          style={{ display: 'none', height: 0, opacity: 0 }}
          role="menu"
        >
          <div className="py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const active = activeMap.get(item.href) === true
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'text-base font-medium transition-colors',
                      active ? 'text-accent-400' : 'text-neutral-400 hover:text-neutral-100'
                    )}
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}


