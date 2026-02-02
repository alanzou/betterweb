'use client'

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#cta' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#050510]/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={{
        height: isScrolled ? '64px' : '80px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#home');
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-[#050510] font-bold text-lg font-['Orbitron']">BW</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:block font-['Orbitron']">
            Better Web
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="relative text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#00d4ff] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection('#cta')}
            className="px-6 py-2.5 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#050510]/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-white/70 hover:text-white transition-colors duration-300 py-2"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => scrollToSection('#cta')}
            className="mt-2 px-6 py-3 bg-[#00d4ff] text-[#050510] rounded-lg font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
