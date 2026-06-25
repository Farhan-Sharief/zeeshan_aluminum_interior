'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000',
    title: 'Bespoke Interiors',
    subtitle: 'Where Luxury Meets Craftsmanship',
  },
  {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
    title: 'Architectural Elegance',
    subtitle: 'Premium Aluminum & Glass Systems',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000',
    title: 'Masterful Designs',
    subtitle: 'Tailored TV Units & Modular Solutions',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-charcoal">
      {/* Background Slides with Slow Ken Burns Effect */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5 } }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <motion.div
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, ease: 'linear' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[current].image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Sophisticated Overlays for Royal Feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal/90" />
      <div className="absolute inset-0 z-0 bg-black/30" /> {/* Uniform darkening for text readability */}

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-24">
        <div className="max-w-5xl mx-auto w-full">
          {/* Subtle Royal Accent Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'circOut' }}
            className="h-[1px] w-24 bg-gold mb-8 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="space-y-4"
          >
            <h2 className="text-gold text-sm md:text-base tracking-[0.3em] uppercase font-light">
              Zeeshan Aluminum Interior
            </h2>
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-5xl md:text-7xl lg:text-8xl font-heading text-white font-normal tracking-tight leading-[1.1]"
              >
                {heroSlides[current].title}
              </motion.h1>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${current}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg md:text-2xl text-white/80 font-light max-w-2xl pt-4"
              >
                {heroSlides[current].subtitle}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16 flex flex-col sm:flex-row gap-6 items-start"
          >
            <Link 
              href="/interior-work" 
              className="group relative px-8 py-4 bg-gold text-charcoal font-medium text-sm tracking-widest uppercase overflow-hidden transition-all hover:bg-white"
            >
              <span className="relative z-10 transition-colors duration-300">Explore Portfolio</span>
            </Link>
            <Link 
              href="/contact" 
              className="group px-8 py-4 border border-white/30 text-white font-medium text-sm tracking-widest uppercase transition-all hover:border-gold hover:text-gold"
            >
              Consult With Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Minimalist Slide Navigation */}
      <div className="absolute bottom-12 right-6 md:right-24 z-20 flex items-center gap-4">
        <span className="text-white/50 text-xs tracking-widest font-light">
          0{current + 1}
        </span>
        <div className="flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative py-2 px-1 focus:outline-none"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className={`h-[1px] transition-all duration-700 ease-out ${
                i === current ? 'w-12 bg-gold' : 'w-6 bg-white/30 hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>
        <span className="text-white/50 text-xs tracking-widest font-light">
          0{heroSlides.length}
        </span>
      </div>
    </section>
  );
}
