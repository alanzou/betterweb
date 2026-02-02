'use client'

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageCircle, Shield, Clock } from 'lucide-react';

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#00ff88]/10" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00d4ff]/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Content */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 mb-8">
            <MessageCircle size={16} className="text-[#00d4ff]" />
            <span className="text-sm text-[#00d4ff]">Free Consultation</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-['Orbitron']">
            Ready to Transform Your
            <br />
            <span className="text-gradient">Online Presence?</span>
          </h2>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-[#a0a0b0] max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Let's create something amazing together. Get started today and see the
            difference a professional website can make for your business.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button className="btn-primary flex items-center gap-2 group text-lg px-10 py-5">
              Start Your Project
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-700 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { icon: <Shield size={18} />, text: 'No Commitment Required' },
              { icon: <Clock size={18} />, text: 'Response within 24 hours' },
              { icon: <MessageCircle size={18} />, text: 'Free consultation call' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-[#a0a0b0]"
              >
                <span className="text-[#00ff88]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
