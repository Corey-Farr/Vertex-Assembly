import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="container-custom text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white word-spacing-wide">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-300">
          Page Not Found
        </h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  )
}

