import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Testimonials from './sections/Testimonials';
import Pricing from './sections/Pricing';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

function App() {
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
  );
}

export default App;
