'use client';
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const quickLinks = [
  { name: 'Home Portfolio', href: '/' },
  { name: 'TV & Media Units', href: '/tv-cabinets' },
  { name: 'Structural Aluminum', href: '/aluminum-work' },
  { name: 'Interior Masterpieces', href: '/interior-work' },
  { name: 'Schedule Consultation', href: '/contact' },
];

const services = [
  'Bespoke TV Cabinets',
  'Premium Aluminum Fabrication',
  'Complete Interior Design',
  'Modular Storage Systems',
  'Luxury Wardrobes',
  'Gypsum False Ceilings',
  'Modern Kitchen Interiors',
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Footer */}
      <div className="container-custom pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gold flex items-center justify-center">
                  <span className="text-gold font-heading font-normal text-2xl">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-heading text-xl font-light tracking-widest leading-tight">
                    ZEESHAN
                  </span>
                  <span className="text-gold text-[9px] uppercase tracking-[0.3em] leading-tight mt-1">
                    Aluminum & Interior
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-white/50 text-xs leading-loose mb-8 font-light pr-4">
              Pioneers in high-end architectural aluminum and bespoke interior styling. Transforming visions into reality with uncompromising quality.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaWhatsapp, href: 'https://wa.me/918867218051', label: 'WhatsApp' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-500 hover:-translate-y-1"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading text-lg mb-8 font-light">Sitemap</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-white/50 hover:text-gold uppercase tracking-widest transition-colors duration-300 flex items-center gap-3 group">
                    <span className="w-4 h-[1px] bg-white/20 group-hover:bg-gold transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-heading text-lg mb-8 font-light">Expertise</h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service} className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1 h-1 bg-gold/50 rounded-full" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading text-lg mb-8 font-light">Private Consultation</h4>
            <div className="space-y-6">
              <a href="tel:+918867218051" className="flex items-start gap-4 text-xs text-white/50 hover:text-gold uppercase tracking-widest transition-colors group">
                <FaPhone className="mt-0.5 text-gold/50 group-hover:text-gold transition-colors" size={12} />
                <span className="leading-relaxed">+91 88672 18051</span>
              </a>
              <a href="mailto:zeeshanaluminiumfabricationand@gmail.com" className="flex items-start gap-4 text-xs text-white/50 hover:text-gold uppercase tracking-widest transition-colors group">
                <FaEnvelope className="mt-0.5 text-gold/50 group-hover:text-gold transition-colors" size={12} />
                <span className="leading-relaxed whitespace-normal break-all">zeeshanaluminiumfabricationand@gmail.com</span>
              </a>
              <div className="flex items-start gap-4 text-xs text-white/50 uppercase tracking-widest">
                <FaMapMarkerAlt className="mt-0.5 text-gold/50 flex-shrink-0" size={12} />
                <span className="leading-relaxed">Zeeshan Architectural Studio,<br />Main Road City Market,<br />State, India</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container-custom py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            © {new Date().getFullYear()} Zeeshan Aluminum Interior. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
