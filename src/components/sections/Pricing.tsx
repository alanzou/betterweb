'use client'

import { useEffect, useRef, useState } from 'react';
import { Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
  icon: React.ReactNode;
  priceId: string;
}

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '$199',
      period: 'one-time',
      description: 'Perfect for small businesses getting started',
      features: [
        'Custom 5-page website design',
        'Mobile-responsive layout',
        'Basic SEO optimization',
        'Contact form integration',
        '2 rounds of revisions',
        '30-day support',
      ],
      cta: 'Get Started',
      highlighted: false,
      icon: <Zap size={24} />,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || '',
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Everything in Starter, plus:',
        'Unlimited pages',
        'Premium hosting included',
        'Priority email support',
        'Monthly content updates',
        'Advanced SEO tools',
        'Analytics dashboard',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      badge: 'Most Popular',
      icon: <Sparkles size={24} />,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || '',
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For businesses that need it all',
      features: [
        'Everything in Professional, plus:',
        'Dedicated account manager',
        'Phone & priority support',
        'Weekly content updates',
        'Custom integrations',
        'Performance optimization',
        'Security monitoring',
      ],
      cta: 'Get Started',
      highlighted: false,
      icon: <Crown size={24} />,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || '',
    },
  ];

  const handleCheckout = (plan: PricingPlan) => {
    setLoadingPlan(plan.name);
    // Navigate to customer information page with plan details
    const planKey = plan.name.toLowerCase();
    window.location.href = `/checkout?plan=${planKey}`;
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 md:py-32"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d4ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="section-label">Pricing Plans</span>
          <h2 className="section-title">
            Choose Your <span className="text-gradient">Perfect Plan</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Transparent pricing with no hidden fees. Start with a one-time setup or
            choose a monthly plan for ongoing support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
                transform: plan.highlighted
                  ? 'translateY(-20px) scale(1.02)'
                  : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] text-[#050510] text-xs font-bold rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={`glass-card p-8 h-full transition-all duration-500 ${
                  plan.highlighted
                    ? 'border-[#00d4ff]/30 shadow-[0_0_60px_rgba(0,212,255,0.15)]'
                    : ''
                } ${
                  hoveredCard === index
                    ? 'border-[#00d4ff]/40 shadow-[0_0_40px_rgba(0,212,255,0.2)]'
                    : ''
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-[#00d4ff] to-[#00ff88] text-[#050510]'
                      : 'bg-white/5 text-[#00d4ff]'
                  }`}
                >
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white mb-2 font-['Orbitron']">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-[#a0a0b0] text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-bold text-white font-['Orbitron']">
                    {plan.price}
                  </span>
                  <span className="text-[#a0a0b0] ml-2">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm text-white/80"
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.startsWith('Everything')
                            ? 'bg-[#00d4ff]/10'
                            : 'bg-[#00ff88]/10'
                        }`}
                      >
                        <Check
                          size={12}
                          className={
                            feature.startsWith('Everything')
                              ? 'text-[#00d4ff]'
                              : 'text-[#00ff88]'
                          }
                        />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-[#00d4ff] text-[#050510] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:-translate-y-1'
                      : 'bg-white/5 text-white border border-white/10 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10'
                  }`}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div
          className={`mt-16 flex flex-wrap items-center justify-center gap-8 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            'No Hidden Fees',
            'Cancel Anytime',
            'Money Back Guarantee',
            'SSL Certificate Included',
          ].map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-[#a0a0b0]"
            >
              <Check size={16} className="text-[#00ff88]" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
