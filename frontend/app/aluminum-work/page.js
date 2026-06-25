'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SectionReveal from '@/components/SectionReveal';
import SkeletonCard from '@/components/SkeletonCard';
import { getProjects } from '@/lib/api';

const subcategories = ['All', 'Windows', 'Doors', 'Partitions', 'Railings', 'Structural Work'];

const fallbackAluminumWork = [
  { _id: 'al1', title: 'Premium Sliding Aluminum Windows', slug: 'premium-sliding-aluminum-windows', subcategory: 'Windows', images: [{ url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80' }], description: 'Heavy-duty double-glazed powder-coated sliding windows designed for noise reduction and energy efficiency.', materials: 'Premium Grade Aluminum, DGU Glass, Double weather stripping' },
  { _id: 'al2', title: 'Minimalist Aluminum Frame Glass Doors', slug: 'minimalist-aluminum-frame-glass-doors', subcategory: 'Doors', images: [{ url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' }], description: 'Elegant, modern internal/external doors with slim-profile aluminum borders.', materials: 'Anodized Slim Profile, Toughened Safety Glass' },
  { _id: 'al3', title: 'Acoustic Glass Partition Wall', slug: 'acoustic-glass-partition-wall', subcategory: 'Partitions', images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' }], description: 'Perfect office divider partition system providing privacy and light flow.', materials: 'Sound-insulated seals, aluminum channel tracks' },
  { _id: 'al4', title: 'Balcony Glass & Aluminum Railing', slug: 'balcony-glass-aluminum-railing', subcategory: 'Railings', images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' }], description: 'Sleek, rust-proof aluminum handrail with thick safety glass panes for high-rise view safety.', materials: 'Grade T6 Architectural Aluminum, Laminated Glass' },
];

export default function AluminumWorkPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  useEffect(() => {
    const fetchAluminumProjects = async () => {
      try {
        const res = await getProjects({ category: 'Aluminum Work', limit: 50 });
        if (res.data?.data?.length > 0) {
          setProjects(res.data.data);
        } else {
          setProjects(fallbackAluminumWork);
        }
      } catch {
        setProjects(fallbackAluminumWork);
      } finally {
        setLoading(false);
      }
    };
    fetchAluminumProjects();
  }, []);

  const filtered = activeSubcategory === 'All'
    ? projects
    : projects.filter(p => p.subcategory === activeSubcategory || p.tags?.includes(activeSubcategory));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Banner Section */}
        <section className="relative pt-32 pb-20 bg-charcoal text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80)' }} />
          <div className="relative z-10 container-custom">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Aluminum Fabrication</h1>
            <div className="gold-line mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg">
              Premium grade windows, doors, office partitions, and custom structural work built with accuracy and structural reliability.
            </p>
          </div>
        </section>

        {/* Categories / Grid */}
        <section className="container-custom section-padding">
          {/* Subcategory Filters */}
          <SectionReveal className="flex flex-wrap justify-center gap-3 mb-12">
            {subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setActiveSubcategory(subcat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSubcategory === subcat
                    ? 'bg-charcoal text-white'
                    : 'bg-white text-silver hover:text-charcoal border border-gray-200'
                }`}
              >
                {subcat}
              </button>
            ))}
          </SectionReveal>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <SectionReveal key={project._id} delay={i * 0.08}>
                  <Link href={`/projects/${project.slug}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={project.images?.[0]?.url || '/placeholder.jpg'}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-gold/90 text-white text-xs font-medium rounded-full">
                          {project.subcategory || 'Aluminum Work'}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-charcoal mb-2 group-hover:text-gold transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-silver text-sm line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                        {project.materials && (
                          <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-1 items-center text-xs text-silver">
                            <span className="font-medium text-charcoal/70">Specs:</span>
                            <span className="line-clamp-1">{project.materials}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-silver">
              No aluminum fabrication designs found in this category.
            </div>
          )}
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
