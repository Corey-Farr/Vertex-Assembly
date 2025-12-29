import clsx from 'clsx'

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={clsx(
        align === 'center' ? 'text-center mx-auto' : 'text-left',
        'max-w-3xl',
        className
      )}
    >
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-400/90 mb-3">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white word-spacing-wide">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed">{description}</p>
      ) : null}
    </div>
  )
}


