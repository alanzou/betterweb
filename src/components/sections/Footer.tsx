'use client'

import { useEffect, useRef, useState } from 'react';
import { Twitter, Linkedin, Instagram, Dribbble } from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const footerLinks = {
    Services: [
      'Custom Web Design',
      'Responsive Development',
      'E-Commerce Solutions',
      'SEO Optimization',
      'Website Maintenance',
    ],
    Company: ['About Us', 'Our Process', 'Case Studies', 'Blog', 'Careers'],
    Support: ['Help Center', 'Contact Us', 'FAQs', 'Documentation', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Dribbble size={20} />, href: '#', label: 'Dribbble' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0a0a1a] border-t border-white/5"
    >
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div
          className={`grid grid-cols-2 md:grid-cols-6 gap-8 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Logo & Description */}
          <div className="col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
                <span className="text-[#050510] font-bold text-lg font-['Orbitron']">
                  BW
                </span>
              </div>
              <span className="text-white font-semibold text-lg font-['Orbitron']">
                Better Web
              </span>
            </a>
            <p className="text-[#a0a0b0] text-sm leading-relaxed max-w-xs">
              Creating digital experiences that inspire and convert. We build websites
              that drive real business results.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <div
              key={category}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${100 + categoryIndex * 100}ms` }}
            >
              <h4 className="text-white font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-[#a0a0b0] text-sm hover:text-[#00d4ff] transition-colors duration-300 relative group"
                    >
                      {link}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00d4ff] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Copyright */}
          <p className="text-[#a0a0b0] text-sm">
            © {new Date().getFullYear()} Better Web. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#a0a0b0] hover:text-[#00d4ff] hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/10 transition-all duration-300 hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
