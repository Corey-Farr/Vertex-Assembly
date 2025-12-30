import HeroCapabilitiesParallax from '@/components/sections/home/HeroCapabilitiesParallax'
import SignatureSystems from '@/components/sections/home/SignatureSystems'
import Process from '@/components/sections/home/Process'
import FeaturedWork from '@/components/sections/home/FeaturedWork'
import MetricsStrip from '@/components/sections/home/MetricsStrip'
import LogosMarquee from '@/components/sections/home/LogosMarquee'
import FinalCTA from '@/components/sections/home/FinalCTA'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero + Capabilities with parallax overlap effect */}
      <HeroCapabilitiesParallax />
      
      <SignatureSystems />
      <Process />
      <FeaturedWork />
      <MetricsStrip />
      <LogosMarquee />
      <FinalCTA />
    </div>
  )
}
