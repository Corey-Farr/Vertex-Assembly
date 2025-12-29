import Hero from '@/components/sections/home/Hero'
import Capabilities from '@/components/sections/home/Capabilities'
import SignatureSystems from '@/components/sections/home/SignatureSystems'
import Process from '@/components/sections/home/Process'
import FeaturedWork from '@/components/sections/home/FeaturedWork'
import MetricsStrip from '@/components/sections/home/MetricsStrip'
import LogosMarquee from '@/components/sections/home/LogosMarquee'
import FinalCTA from '@/components/sections/home/FinalCTA'

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <Capabilities />
      <SignatureSystems />
      <Process />
      <FeaturedWork />
      <MetricsStrip />
      <LogosMarquee />
      <FinalCTA />
    </div>
  )
}

