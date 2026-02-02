import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      quote:
        "Better Web transformed our online presence completely. Our new website increased leads by 340% in just three months. The design is stunning and the functionality is flawless.",
      author: 'Sarah Mitchell',
      role: 'CEO, TechStart Inc.',
      avatar: '/avatar1.jpg',
    },
    {
      quote:
        "Working with Better Web was an absolute pleasure. They understood our vision immediately and delivered beyond our expectations. Our e-commerce sales have never been better.",
      author: 'Michael Chen',
      role: 'Founder, GreenLeaf Organics',
      avatar: '/avatar2.jpg',
    },
    {
      quote:
        "The attention to detail and commitment to quality is unmatched. Better Web doesn't just build websites—they create digital experiences that truly represent your brand.",
      author: 'Emily Rodriguez',
      role: 'Marketing Director, Elevate Studios',
      avatar: '/avatar3.jpg',
    },
  ];

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

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 3,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -2) {
      return {
        transform: 'translateX(120%) scale(0.8) rotateY(-25deg)',
        opacity: 0.4,
        zIndex: 1,
      };
    } else {
      return {
        transform: 'translateX(-120%) scale(0.8) rotateY(25deg)',
        opacity: 0.4,
        zIndex: 1,
      };
    }
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="section-label">Client Stories</span>
          <h2 className="section-title">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real results from real businesses. Here's how we've helped transform their
            digital presence.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className={`relative max-w-4xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Cards Container */}
          <div
            className="relative h-[400px] md:h-[350px] perspective-1000"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-700 ease-out preserve-3d"
                style={getCardStyle(index)}
              >
                <div className="glass-card h-full p-8 md:p-12 flex flex-col justify-center">
                  {/* Quote Icon */}
                  <Quote
                    size={48}
                    className="text-[#00d4ff]/30 mb-6"
                  />

                  {/* Quote Text */}
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#00d4ff]/30"
                    />
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.author}
                      </div>
                      <div className="text-[#a0a0b0] text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#00d4ff]'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
