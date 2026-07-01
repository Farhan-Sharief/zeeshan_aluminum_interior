'use client';
import { motion } from 'framer-motion';
import SectionReveal from '../SectionReveal';
import Link from 'next/link';

const services = [
  { 
    title: 'TV Cabinets', 
    desc: 'Bespoke media units blending cutting-edge aesthetics with functional elegance.', 
    href: '/tv-cabinets',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    number: '01'
  },
  { 
    title: 'Aluminum Works', 
    desc: 'Precision-crafted aluminum windows, partitions, and structural facades.', 
    href: '/aluminum-work',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
    number: '02'
  },
  { 
    title: 'Interior Design', 
    desc: 'Comprehensive interior styling capturing the essence of modern luxury.', 
    href: '/interior-work',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800',
    number: '03'
  },
  { 
    title: 'Modular Kitchens', 
    desc: 'State-of-the-art culinary spaces designed for the discerning homeowner.', 
    href: '/interior-work',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800',
    number: '04'
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-warm-white" id="services">
      <div className="container-custom">
        <SectionReveal className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
          <div className="max-w-2xl">
            <span className="text-gold text-xs tracking-[0.3em] font-medium uppercase mb-4 block">
              Areas of Expertise
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-charcoal font-light leading-tight">
              Mastering the Art of <br />
              <span className="text-gold italic font-serif">Spatial Elegance</span>
            </h2>
          </div>
          <p className="text-silver text-sm md:text-base max-w-md mt-6 md:mt-0 leading-relaxed font-light">
            We deliver uncompromising quality in architectural aluminum and custom interior fabrications. Our process is rooted in precision and modern luxury.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <SectionReveal key={service.title} delay={i * 0.1}>
              <Link href={service.href} className="group block">
                <motion.div
                  whileHover="hover"
                  className="relative h-[450px] w-full overflow-hidden rounded-sm bg-charcoal"
                >
                  <motion.div 
                    variants={{
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <span className="text-gold font-light tracking-widest text-sm">
                      {service.number}
                    </span>
                    
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-heading text-2xl text-white font-normal mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white/70 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border border-white/10 scale-[0.98] group-hover:scale-100 transition-transform duration-700 pointer-events-none" />
                </motion.div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
