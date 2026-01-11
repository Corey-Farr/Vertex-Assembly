'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ensureScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap'
import { applySplitText } from '@/lib/textSplit'

// ============================================================================
// Types
// ============================================================================

interface FormData {
  name: string
  email: string
  company: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

// ============================================================================
// API Hook (wire your real API here)
// ============================================================================

/**
 * Hook to handle form submission
 * Replace the simulated timeout with your actual API call
 */
function useContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (data: FormData): Promise<boolean> => {
    setStatus('submitting')
    setError(null)

    try {
      // ================================================================
      // WIRE YOUR API HERE
      // Example with fetch:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // if (!response.ok) throw new Error('Failed to send message')
      // ================================================================

      // Simulated API call (remove this when wiring real API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate occasional failure for testing (remove in production)
      // if (Math.random() < 0.1) throw new Error('Simulated error')

      setStatus('success')
      return true
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
      return false
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return { status, error, submit, reset }
}

// ============================================================================
// Animated Input Component
// ============================================================================

interface AnimatedInputProps {
  id: string
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  value: string
  error?: string
  required?: boolean
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
}

function AnimatedInput({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  required,
  placeholder,
  onChange,
  onBlur,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  // Focus animation
  useEffect(() => {
    if (!lineRef.current || prefersReducedMotion()) return

    if (isFocused) {
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(lineRef.current, {
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [isFocused])

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          isFocused ? 'text-accent-400' : error ? 'text-red-400' : 'text-neutral-300'
        }`}
      >
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          id={id}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          className={`w-full px-4 py-4 bg-neutral-900/80 border rounded-lg text-white placeholder-neutral-500 transition-all duration-300 outline-none ${
            error
              ? 'border-red-500 focus:border-red-400'
              : isFocused
              ? 'border-accent-500 bg-neutral-900'
              : 'border-neutral-700 hover:border-neutral-600'
          }`}
        />
        {/* Animated focus line */}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      {/* Error message */}
      <div
        className={`mt-2 text-sm text-red-400 transition-all duration-300 ${
          error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {error || ' '}
      </div>
    </div>
  )
}

// ============================================================================
// Animated Textarea Component
// ============================================================================

interface AnimatedTextareaProps {
  id: string
  name: string
  label: string
  value: string
  error?: string
  required?: boolean
  placeholder?: string
  rows?: number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: () => void
}

function AnimatedTextarea({
  id,
  name,
  label,
  value,
  error,
  required,
  placeholder,
  rows = 5,
  onChange,
  onBlur,
}: AnimatedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lineRef.current || prefersReducedMotion()) return

    if (isFocused) {
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(lineRef.current, {
        scaleX: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [isFocused])

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          isFocused ? 'text-accent-400' : error ? 'text-red-400' : 'text-neutral-300'
        }`}
      >
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          className={`w-full px-4 py-4 bg-neutral-900/80 border rounded-lg text-white placeholder-neutral-500 transition-all duration-300 outline-none resize-none ${
            error
              ? 'border-red-500 focus:border-red-400'
              : isFocused
              ? 'border-accent-500 bg-neutral-900'
              : 'border-neutral-700 hover:border-neutral-600'
          }`}
        />
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      <div
        className={`mt-2 text-sm text-red-400 transition-all duration-300 ${
          error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {error || ' '}
      </div>
    </div>
  )
}

// ============================================================================
// Success Animation Component
// ============================================================================

function SuccessState({ onReset }: { onReset: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<SVGCircleElement>(null)
  const checkPathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const check = checkRef.current
    const checkPath = checkPathRef.current

    if (!container || !check || !checkPath || prefersReducedMotion()) return

    const tl = gsap.timeline()

    // Animate check circle
    tl.fromTo(
      check,
      { strokeDashoffset: 283 },
      { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }
    )

    // Animate checkmark
    tl.fromTo(
      checkPath,
      { strokeDashoffset: 50 },
      { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    // Animate text
    tl.fromTo(
      container.querySelectorAll('.success-text'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      {/* Animated checkmark */}
      <svg
        className="w-24 h-24 mb-8"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
      >
        <circle
          ref={checkRef}
          cx="50"
          cy="50"
          r="45"
          strokeWidth="3"
          className="text-accent-500"
          strokeDasharray="283"
          strokeDashoffset="283"
          strokeLinecap="round"
        />
        <path
          ref={checkPathRef}
          d="M30 52 L44 66 L70 38"
          strokeWidth="4"
          className="text-accent-400"
          strokeDasharray="50"
          strokeDashoffset="50"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <h3 className="success-text text-2xl md:text-3xl font-bold text-white mb-3 opacity-0">
        Message Sent!
      </h3>
      <p className="success-text text-neutral-400 mb-8 max-w-md opacity-0">
        Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
      </p>
      <button
        onClick={onReset}
        className="success-text px-6 py-3 text-sm font-medium text-neutral-300 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:text-white transition-colors duration-300 opacity-0"
      >
        Send Another Message
      </button>
    </div>
  )
}

// ============================================================================
// Main Contact Page
// ============================================================================

export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const { status, error: submitError, submit, reset } = useContactForm()

  // Validation
  const validateField = useCallback((name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        break
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        break
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        break
    }
    return undefined
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    ;(['name', 'email', 'message'] as const).forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [formData, validateField])

  // Handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear error on change if field was touched
      if (touched[name]) {
        const error = validateField(name as keyof FormData, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [touched, validateField]
  )

  const handleBlur = useCallback(
    (name: keyof FormData) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, formData[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [formData, validateField]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Mark all fields as touched
      setTouched({ name: true, email: true, message: true })

      if (!validateForm()) return

      await submit(formData)
    },
    [formData, validateForm, submit]
  )

  const handleReset = useCallback(() => {
    setFormData({ name: '', email: '', company: '', message: '' })
    setErrors({})
    setTouched({})
    reset()
  }, [reset])

  // Hero animations
  useEffect(() => {
    const hero = heroRef.current
    const headline = headlineRef.current

    if (!hero || !headline) return

    let ctx: gsap.Context | null = null
    let splitRestore: (() => void) | null = null
    let killed = false

    const setup = async () => {
      await ensureScrollTrigger()
      if (killed) return

      ctx = gsap.context(() => {
        const isReduced = prefersReducedMotion()

        if (!isReduced) {
          const { elements, restore } = applySplitText(headline, 'words', 'contact-hero')
          splitRestore = restore

          gsap.set(elements, { opacity: 0, y: 50 })
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            delay: 0.15,
            ease: 'power3.out',
          })
        }
      }, hero)
    }

    void setup()

    return () => {
      killed = true
      splitRestore?.()
      ctx?.revert()
    }
  }, [])

  // Form reveal animation
  useEffect(() => {
    const container = formContainerRef.current
    if (!container) return

    let ctx: gsap.Context | null = null
    let killed = false

    const setup = async () => {
      const ScrollTrigger = await ensureScrollTrigger()
      if (!ScrollTrigger || killed) return

      if (prefersReducedMotion()) {
        gsap.set(container, { opacity: 1, y: 0 })
        return
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          container,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }, container)
    }

    void setup()

    return () => {
      killed = true
      ctx?.revert()
    }
  }, [])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section ref={heroRef} className="section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 left-1/3 w-[50rem] h-[50rem] bg-accent-500/10 rounded-full blur-[150px]" />
          <div className="absolute -bottom-32 right-1/3 w-[40rem] h-[40rem] bg-primary-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/70 mb-6">
              Get in Touch
            </div>
            <h1
              ref={headlineRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white word-spacing-wide"
            >
              Let&apos;s build something remarkable.
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Ready to transform your manufacturing operations? We&apos;d love to hear about your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-neutral-900/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                Contact Information
              </h2>
              <div className="space-y-8">
                <div className="group">
                  <h3 className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-[0.2em]">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@vertexassembly.com"
                    className="text-xl text-neutral-300 hover:text-accent-400 transition-colors flex items-center gap-3 group"
                  >
                    <svg
                      className="w-5 h-5 text-neutral-500 group-hover:text-accent-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    hello@vertexassembly.com
                  </a>
                </div>

                <div className="group">
                  <h3 className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-[0.2em]">
                    Phone
                  </h3>
                  <a
                    href="tel:+15551234567"
                    className="text-xl text-neutral-300 hover:text-accent-400 transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-neutral-500 group-hover:text-accent-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    +1 (555) 123-4567
                  </a>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-[0.2em]">
                    Headquarters
                  </h3>
                  <address className="text-lg text-neutral-300 not-italic flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-neutral-500 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span>
                      1234 Innovation Drive
                      <br />
                      Detroit, MI 48201
                      <br />
                      United States
                    </span>
                  </address>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-accent-400 mb-3 uppercase tracking-[0.2em]">
                    Office Hours
                  </h3>
                  <p className="text-lg text-neutral-300 flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Monday – Friday: 9:00 AM – 6:00 PM EST
                  </p>
                </div>
              </div>

              {/* Response time */}
              <div className="mt-12 p-6 rounded-xl bg-neutral-800/30 border border-neutral-700/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-accent-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Quick Response Time</h4>
                    <p className="text-sm text-neutral-400">
                      We typically respond to inquiries within 24-48 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div ref={formContainerRef} className="opacity-0">
              <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                  Send a Message
                </h2>
                <p className="text-neutral-400 mb-8">
                  Fill out the form below and we&apos;ll get back to you shortly.
                </p>

                {status === 'success' ? (
                  <SuccessState onReset={handleReset} />
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
                    <AnimatedInput
                      id="name"
                      name="name"
                      label="Name"
                      value={formData.name}
                      error={touched.name ? errors.name : undefined}
                      required
                      placeholder="Your name"
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                    />

                    <AnimatedInput
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      error={touched.email ? errors.email : undefined}
                      required
                      placeholder="you@company.com"
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                    />

                    <AnimatedInput
                      id="company"
                      name="company"
                      label="Company"
                      value={formData.company}
                      placeholder="Your company (optional)"
                      onChange={handleChange}
                    />

                    <AnimatedTextarea
                      id="message"
                      name="message"
                      label="Message"
                      value={formData.message}
                      error={touched.message ? errors.message : undefined}
                      required
                      placeholder="Tell us about your project, goals, or questions..."
                      rows={5}
                      onChange={handleChange}
                      onBlur={() => handleBlur('message')}
                    />

                    {/* Submit error */}
                    {submitError && (
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full mt-4 relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold tracking-wide text-white bg-accent-500 rounded-lg hover:bg-accent-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
                    >
                      {status === 'submitting' ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
