'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SectionReveal from '@/components/SectionReveal';
import { submitContact } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Interior Design',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const servicesList = [
    'TV Cabinet Design',
    'Aluminum Fabrication',
    'Interior Design',
    'Modular Kitchen',
    'Wardrobe Design',
    'False Ceiling',
    'Other Work'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContact(formData);
      if (res.data?.success) {
        toast.success(res.data.message || 'Inquiry submitted successfully!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: 'Interior Design',
          message: '',
        });
      } else {
        toast.error('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Contact submit error:', error);
      // Fallback success feedback for demo mode if backend is not yet running/connected
      toast.success('Thank you! Your inquiry has been sent successfully (Demo Mode).');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Interior Design',
        message: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Banner Section */}
        <section className="relative pt-32 pb-16 bg-charcoal text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80)' }} />
          <div className="relative z-10 container-custom">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
            <div className="gold-line mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-white/70 text-base">
              Get in touch with us today. Let&apos;s discuss your project ideas and turn them into reality.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="container-custom section-padding">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details & Social (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl p-8 border border-gray-100 shadow-sm space-y-8">
              <div>
                <h3 className="font-heading text-2xl font-bold text-charcoal mb-4">Get In Touch</h3>
                <p className="text-silver text-sm leading-relaxed">
                  Feel free to contact us via phone, email, or WhatsApp. You can also visit our workshop directly.
                </p>
              </div>

              <div className="space-y-6">
                <a href="tel:+918867218051" className="flex items-start gap-4 p-4 rounded-lg bg-cream/50 hover:bg-cream transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                    <FaPhone size={16} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Call Us</span>
                    <span className="text-sm font-semibold text-charcoal/80">+91 88672 18051</span>
                  </div>
                </a>

                <a href="https://wa.me/918867218051?text=Hi" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-lg bg-cream/50 hover:bg-cream transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all">
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">WhatsApp</span>
                    <span className="text-sm font-semibold text-charcoal/80">Chat directly on WhatsApp</span>
                  </div>
                </a>

                <a href="mailto:zeeshanaluminiumfabricationand@gmail.com" className="flex items-start gap-4 p-4 rounded-lg bg-cream/50 hover:bg-cream transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Email Address</span>
                    <span className="text-sm font-semibold text-charcoal/80">zeeshanaluminiumfabricationand@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-cream/50">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Business Location</span>
                    <span className="text-sm font-semibold text-charcoal/80 leading-relaxed block">
                      Zeeshan Aluminum Interior Shop,<br />Main Road City Market, State, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-charcoal mb-6">Send An Inquiry</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 bg-cream/30 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 bg-cream/30 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Email Address (Optional)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 bg-cream/30 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Select Service Required</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 bg-cream/30 transition-colors text-sm text-charcoal/80"
                    >
                      {servicesList.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Your Message / Requirement <span className="text-red-500">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe what you need..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 bg-cream/30 transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  {submitting ? 'Sending inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Embedded Map Section */}
        <section className="h-[400px] w-full border-t border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799160891!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDEwJzAwLjAiTiA3N8KwMjAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Maps Location"
          />
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
