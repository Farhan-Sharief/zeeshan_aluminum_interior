'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { HiChevronUp } from 'react-icons/hi';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/918867218051?text=Hi%2C%20I%27m%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </motion.a>

      {/* Call Button */}
      <motion.a
        href="tel:+918867218051"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:scale-110 transition-transform"
        aria-label="Call Now"
      >
        <FaPhone size={22} className="text-white" />
      </motion.a>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-charcoal/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:text-gold hover:border-gold transition-all"
            aria-label="Scroll to top"
          >
            <HiChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
