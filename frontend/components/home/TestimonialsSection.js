'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionReveal from '../SectionReveal';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { getTestimonials } from '@/lib/api';

const fallbackTestimonials = [
  { _id: '1', clientName: 'Rahul Sharma', review: 'The level of detail and precision in their aluminum framework is unparalleled. Our residence now possesses a gallery-like sophistication.', designation: 'Private Residence Owner' },
  { _id: '2', clientName: 'Priya Gupta', review: 'A masterclass in modern interior execution. Their ability to translate architectural concepts into tangible, luxurious living spaces is exceptional.', designation: 'Lead Architect' },
  { _id: '3', clientName: 'Ahmed Khan', review: 'From the bespoke TV cabinetry to the structural glazing, every element was delivered with absolute perfection and professionalism.', designation: 'Property Developer' },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getTestimonials();
        if (res.data?.data?.length > 0) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch {
        setTestimonials(fallbackTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-cream text-charcoal relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <div className="lg:col-span-4">
            <SectionReveal>
              <span className="text-gold text-xs tracking-[0.3em] font-medium uppercase mb-4 block">
                Client Reflections
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-light leading-tight mb-8">
                Words of <br />
                <span className="text-gold italic font-serif">Appreciation</span>
              </h2>
              
              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="flex gap-4 mt-12">
                  <button
                    onClick={prev}
                    className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-gold hover:bg-gold hover:text-white transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    <HiArrowLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-gold hover:bg-gold hover:text-white transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    <HiArrowRight size={16} />
                  </button>
                </div>
              )}
            </SectionReveal>
          </div>

          <div className="lg:col-span-8 relative">
            <span className="absolute -top-16 -left-8 text-9xl font-serif text-charcoal/5 select-none pointer-events-none">
              &ldquo;
            </span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 pl-8 md:pl-16 border-l border-gold/30 py-4"
              >
                <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mb-10 text-charcoal/90">
                  {testimonials[current]?.review}
                </p>

                <div>
                  <p className="font-heading text-xl font-normal tracking-wide">
                    {testimonials[current]?.clientName}
                  </p>
                  {testimonials[current]?.designation && (
                    <p className="text-gold text-xs tracking-widest uppercase mt-2 font-medium">
                      {testimonials[current].designation}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
