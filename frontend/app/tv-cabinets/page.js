'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SectionReveal from '@/components/SectionReveal';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import SkeletonCard from '@/components/SkeletonCard';
import { getProjects } from '@/lib/api';

const subcategories = ['All', 'Modern', 'Minimalist', 'Wooden Finish', 'Wall Mounted'];

const fallbackTVCabinets = [
  { _id: 'tv1', title: 'Minimalist Charcoal TV Unit', slug: 'minimalist-charcoal-tv-unit', subcategory: 'Minimalist', images: [{ url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&q=80' }], description: 'A sleek, space-saving TV cabinet with clean charcoal paneling and floating shelves.', materials: 'Premium MDF, Acrylic Finish, LED Lights' },
  { _id: 'tv2', title: 'Classic Walnut & Gold TV Console', slug: 'classic-walnut-gold-tv-console', subcategory: 'Wooden Finish', images: [{ url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' }], description: 'Warm walnut texture combined with gold trims to match luxury interiors.', materials: 'Walnut Veneer, Matte Gold Inlays, Soft-close drawers' },
  { _id: 'tv3', title: 'Floating Glass Front Media Center', slug: 'floating-glass-front-media-center', subcategory: 'Wall Mounted', images: [{ url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80' }], description: 'Modern floating console with smoked glass front panel for smart device integration.', materials: 'Tempered Glass, Engineered Wood, Smart Cable Management' },
  { _id: 'tv4', title: 'Ultra-Modern Marble Backdrop Unit', slug: 'ultra-modern-marble-backdrop-unit', subcategory: 'Modern', images: [{ url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80' }], description: 'Sophisticated TV back panel styling using quartz marble sheet overlay with cove lighting.', materials: 'Quartz Sheet, MDF Board, Custom LED strips' },
];

export default function TVCabinetsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  useEffect(() => {
    const fetchTVProjects = async () => {
      try {
        const res = await getProjects({ category: 'TV Cabinet', limit: 50 });
        if (res.data?.data?.length > 0) {
          setProjects(res.data.data);
        } else {
          setProjects(fallbackTVCabinets);
        }
      } catch {
        setProjects(fallbackTVCabinets);
      } finally {
        setLoading(false);
      }
    };
    fetchTVProjects();
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
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80)' }} />
          <div className="relative z-10 container-custom">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">TV Cabinets & Consoles</h1>
            <div className="gold-line mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg">
              Elevate your entertainment space with custom-crafted modern TV cabinets that combine luxurious aesthetics with smart storage.
            </p>
          </div>
        </section>

        {/* Before / After Showcase */}
        <section className="container-custom section-padding">
          <SectionReveal className="text-center mb-12">
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-semibold">Transformations</span>
            <h2 className="section-title mt-3">Before & After Concepts</h2>
            <div className="gold-line mx-auto mt-4 mb-6" />
            <p className="section-subtitle mx-auto">
              Drag the slider to see how we transform empty walls into luxury entertainment consoles.
            </p>
          </SectionReveal>

          <SectionReveal className="max-w-4xl mx-auto">
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80"
              afterImage="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80"
            />
          </SectionReveal>
        </section>

        {/* Filter & Projects Gallery */}
        <section className="container-custom pb-24">
          <SectionReveal className="text-center mb-12">
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-semibold">Our Portfolio</span>
            <h2 className="section-title mt-3">Designs Gallery</h2>
            <div className="gold-line mx-auto mt-4" />
          </SectionReveal>

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
                          {project.subcategory || 'TV Cabinet'}
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
                            <span className="font-medium text-charcoal/70">Materials:</span>
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
              No TV Cabinet designs found in this category.
            </div>
          )}
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
