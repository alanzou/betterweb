import { useEffect, useRef, useState } from 'react';
import { Palette, Monitor, ShoppingCart, Check } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delay: number;
}

const ServiceCard = ({ icon, title, description, features, delay }: ServiceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card glow-border p-8 transition-all duration-700 perspective-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(${isVisible ? '0' : '-50px'})`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
        <div className="text-[#00d4ff]">{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-4 font-['Orbitron']">{title}</h3>

      {/* Description */}
      <p className="text-[#a0a0b0] mb-6 leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-white/80">
            <span className="w-5 h-5 rounded-full bg-[#00ff88]/10 flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-[#00ff88]" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Services = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Palette size={28} />,
      title: 'Custom Web Design',
      description:
        'Unique, tailor-made designs that capture your brand essence and captivate your audience from the first click.',
      features: [
        'Brand-aligned visuals',
        'User-centered design',
        'Mobile-first approach',
        'Conversion optimized',
      ],
    },
    {
      icon: <Monitor size={28} />,
      title: 'Responsive Development',
      description:
        'Flawless performance across all devices. Your website looks stunning and functions perfectly everywhere.',
      features: [
        'Cross-device testing',
        'Fast load times',
        'SEO-friendly code',
        'Accessibility compliant',
      ],
    },
    {
      icon: <ShoppingCart size={28} />,
      title: 'E-Commerce Solutions',
      description:
        'Powerful online stores that drive sales. Secure checkout, inventory management, and seamless user experience.',
      features: [
        'Secure payments',
        'Inventory sync',
        'Abandoned cart recovery',
        'Analytics dashboard',
      ],
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#00d4ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="section-label">What We Do</span>
          <h2 className="section-title">
            Services That Transform Your
            <br />
            <span className="text-gradient">Digital Presence</span>
          </h2>
          <p className="section-subtitle mx-auto">
            From concept to launch, we handle every aspect of your website with precision
            and creativity. Our comprehensive services ensure your success.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
