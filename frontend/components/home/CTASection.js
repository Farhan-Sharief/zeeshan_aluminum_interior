'use client';
import Link from 'next/link';
import SectionReveal from '../SectionReveal';

export default function CTASection() {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax-like feel */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2000)',
        }}
      />
      {/* Deep overlay for text readability and luxury feel */}
      <div className="absolute inset-0 bg-charcoal/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <SectionReveal className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-[1px] bg-gold mb-8" />
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-white font-light leading-tight mb-8">
            Envisioning Your <br />
            <span className="text-gold italic font-serif">Next Masterpiece</span>
          </h2>
          
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Begin the journey toward architectural refinement. Schedule a private consultation to discuss your bespoke interior and aluminum requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/contact" 
              className="group relative px-10 py-4 bg-gold text-charcoal font-medium text-xs md:text-sm tracking-widest uppercase overflow-hidden transition-all hover:bg-white w-full sm:w-auto"
            >
              <span className="relative z-10 transition-colors duration-300">Schedule Consultation</span>
            </Link>
            <a 
              href="tel:+919000000000" 
              className="group px-10 py-4 border border-white/30 text-white font-medium text-xs md:text-sm tracking-widest uppercase transition-all hover:border-gold hover:text-gold w-full sm:w-auto"
            >
              Speak With Us
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
