'use client'

import Link from 'next/link'

const footerLinks = {
  company: [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/news', label: 'News' },
    { href: '/contact', label: 'Contact' },
  ],
  solutions: [
    { href: '/solutions#automation', label: 'Automation' },
    { href: '/solutions#robotics', label: 'Robotics' },
    { href: '/solutions#production', label: 'Production Systems' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900/50">
      <div className="container-custom section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-accent-400">V</span>ERTEX
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium robotics and automated production systems for the future of manufacturing.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-neutral-200">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-neutral-200">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-neutral-200">Connect</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>hello@vertexassembly.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Vertex Assembly. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

