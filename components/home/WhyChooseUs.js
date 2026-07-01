'use client';
import SectionReveal from '../SectionReveal';

const reasons = [
  { title: 'Premium Materials', desc: 'We source only the highest echelon of architectural materials, ensuring longevity and a flawless finish.' },
  { title: 'Artisan Craftsmanship', desc: 'Our artisans bring decades of specialized experience, executing complex designs with unwavering precision.' },
  { title: 'Bespoke Customization', desc: 'Every project is exclusively tailored, reflecting the distinct aesthetic and functional needs of our clients.' },
  { title: 'Uncompromising Quality', desc: 'We never compromise on the details. Every joint, seam, and finish is inspected to meet our exacting standards.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-charcoal text-white relative overflow-hidden">
      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionReveal className="mb-20">
          <span className="text-gold text-xs tracking-[0.3em] font-medium uppercase mb-4 block">
            The Zeeshan Standard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light leading-tight">
            Why Discerning Clients <br />
            <span className="text-gold italic font-serif">Choose Us</span>
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {reasons.map((reason, i) => (
            <SectionReveal key={reason.title} delay={i * 0.1}>
              <div className="group">
                <div className="flex items-center gap-6 mb-4">
                  <span className="text-gold font-light tracking-widest text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </span>
                  <h3 className="font-heading text-2xl font-light tracking-wide text-white group-hover:text-gold transition-colors duration-300">
                    {reason.title}
                  </h3>
                </div>
                <div className="pl-11">
                  <p className="text-white/60 font-light text-sm md:text-base leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
                <div className="mt-8 h-[1px] w-full bg-white/10 group-hover:bg-gold/30 transition-colors duration-500" />
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
