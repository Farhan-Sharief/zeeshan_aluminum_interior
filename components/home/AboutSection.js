'use client';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import SectionReveal from '../SectionReveal';

const stats = [
  { value: 10, suffix: '+', label: 'Years of Mastery' },
  { value: 500, suffix: '+', label: 'Curated Projects' },
  { value: 350, suffix: '+', label: 'Esteemed Clients' },
  { value: 15, suffix: '+', label: 'Service Regions' },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-24 md:py-32 bg-white" id="about">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Text Content (Left side, spans 7 cols) */}
          <div className="lg:col-span-7">
            <SectionReveal>
              <span className="text-gold text-xs tracking-[0.3em] font-medium uppercase mb-4 block">
                The Heritage
              </span>
              <h2 className="text-4xl md:text-5xl font-heading text-charcoal font-light leading-tight mb-8">
                Crafting Spaces of <br />
                <span className="text-gold italic font-serif">Uncompromising Quality</span>
              </h2>
              
              <div className="space-y-6 text-charcoal/70 font-light leading-relaxed text-sm md:text-base">
                <p>
                  At Zeeshan Aluminum Interior, we view every project as a canvas for architectural refinement. For over a decade, we have been the vanguard of bespoke aluminum fabrication and luxury interior solutions, catering to clients who demand nothing short of perfection.
                </p>
                <p>
                  Our ethos is built upon the meticulous sourcing of premium materials, married with generational craftsmanship. From seamless TV unit integrations to expansive modular kitchens, our designs are defined by clean lines, modern sophistication, and enduring elegance.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  'Architectural Grade Materials',
                  'Artisan Craftsmanship',
                  'Tailored Bespoke Designs',
                  'Impeccable Precision',
                ].map((item, idx) => (
                  <div key={item} className="flex items-center gap-3 text-xs md:text-sm text-charcoal uppercase tracking-widest font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Stats Grid (Right side, spans 5 cols) */}
          <div className="lg:col-span-5 relative" ref={ref}>
            <SectionReveal delay={0.2} className="grid grid-cols-2 gap-x-8 gap-y-16">
              {stats.map((stat, i) => (
                <div key={stat.label} className="relative">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-heading text-charcoal font-light tracking-tighter mb-4">
                    {inView ? (
                      <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </div>
                  <div className="h-[1px] w-12 bg-gold mb-4" />
                  <p className="text-silver text-xs uppercase tracking-widest font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </SectionReveal>

            {/* Decorative background element */}
            <div className="absolute -z-10 -right-12 -bottom-12 w-64 h-64 bg-cream rounded-full blur-3xl opacity-50" />
          </div>

        </div>
      </div>
    </section>
  );
}
