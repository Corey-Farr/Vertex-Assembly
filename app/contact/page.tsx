'use client'

import { useEffect, useRef, useState } from 'react'
import { revealOnScroll } from '@/lib/animations'

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (heroRef.current) {
      revealOnScroll(heroRef.current)
    }
    if (formRef.current) {
      revealOnScroll(formRef.current)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section">
        <div className="container-custom">
          <div ref={heroRef} className="max-w-3xl mx-auto text-center opacity-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide">
              Get in Touch
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Let's discuss how we can transform your manufacturing operations
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white word-spacing-normal">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-accent-400 mb-2 uppercase tracking-wider">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@vertexassembly.com"
                    className="text-lg text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    hello@vertexassembly.com
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-accent-400 mb-2 uppercase tracking-wider">
                    Phone
                  </h3>
                  <a
                    href="tel:+15551234567"
                    className="text-lg text-neutral-300 hover:text-accent-400 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-accent-400 mb-2 uppercase tracking-wider">
                    Office Hours
                  </h3>
                  <p className="text-lg text-neutral-300">
                    Monday - Friday: 9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white word-spacing-normal">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-neutral-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitted}
                >
                  {submitted ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

