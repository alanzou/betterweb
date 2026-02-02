import Navigation from '@/components/sections/Navigation'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
