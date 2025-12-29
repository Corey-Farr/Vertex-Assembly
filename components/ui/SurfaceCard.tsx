import clsx from 'clsx'

export default function SurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-neutral-800 bg-neutral-900/30',
        'hover:bg-neutral-900/45 hover:border-neutral-700 transition-colors duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}


