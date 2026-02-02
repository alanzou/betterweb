'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/logo.jpg"
          alt="Better Web Background"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/60 via-[#050510]/40 to-[#050510]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/80 via-transparent to-[#050510]/80" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00d4ff] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          <span className="text-sm text-white/70">Premium Web Design Agency</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {['We Design', 'Websites That', 'Convert Visitors', 'Into Customers'].map(
            (line, index) => (
              <span
                key={index}
                className={`block transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + index * 120}ms` }}
              >
                {index === 2 ? (
                  <span className="text-gradient">{line}</span>
                ) : (
                  line
                )}
              </span>
            )
          )}
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl text-[#a0a0b0] max-w-2xl mx-auto mb-10 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          Premium web design and development services that elevate your brand and drive
          real business results. From concept to launch, we handle it all.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1100ms' }}
        >
          <button
            onClick={() => scrollToSection('#cta')}
            className="btn-primary flex items-center gap-2 group"
          >
            Start Your Project
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={() => scrollToSection('#services')}
            className="btn-secondary flex items-center gap-2"
          >
            <Play size={18} className="text-[#00d4ff]" />
            View Our Work
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1300ms' }}
        >
          {[
            { value: '500+', label: 'Websites Built' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '10+', label: 'Years Experience' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#00d4ff] font-['Orbitron']">
                {stat.value}
              </div>
              <div className="text-sm text-[#a0a0b0] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent z-[2]" />
    </section>
  );
};

export default Hero;
