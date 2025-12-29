import clsx from 'clsx'

export default function Section({
  id,
  children,
  className,
  variant = 'default',
}: {
  id?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'tight' | 'flush'
}) {
  return (
    <section
      id={id}
      className={clsx(
        'relative',
        // offset anchor positioning for sticky navbar
        'scroll-mt-[calc(var(--va-nav-h)+1rem)]',
        variant === 'default' && 'section',
        variant === 'tight' && 'py-16 md:py-20 lg:py-24',
        variant === 'flush' && 'py-0',
        className
      )}
    >
      {children}
    </section>
  )
}


