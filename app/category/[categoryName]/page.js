'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SectionReveal from '@/components/SectionReveal';
import SkeletonCard from '@/components/SkeletonCard';
import { getProjects } from '@/lib/api';

export default function DynamicCategoryPage({ params }) {
  const resolvedParams = use(params);
  const rawCategoryName = resolvedParams.categoryName;
  const categoryName = decodeURIComponent(rawCategoryName);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState(['All']);
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  useEffect(() => {
    if (!categoryName) return;
    const fetchCategoryProjects = async () => {
      try {
        const res = await getProjects({ category: categoryName, limit: 50 });
        if (res.data?.success && res.data.data?.length > 0) {
          const fetchedProjects = res.data.data;
          setProjects(fetchedProjects);

          // Extract unique subcategories
          const subcats = new Set(['All']);
          fetchedProjects.forEach(proj => {
            if (proj.subcategory) subcats.add(proj.subcategory);
          });
          setSubcategories(Array.from(subcats));
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error('Error loading projects for category:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProjects();
  }, [categoryName]);

  const filtered = activeSubcategory === 'All'
    ? projects
    : projects.filter(p => p.subcategory === activeSubcategory || p.tags?.includes(activeSubcategory));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Banner Section */}
        <section className="relative pt-32 pb-20 bg-charcoal text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80)' }} />
          <div className="relative z-10 container-custom">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{categoryName}</h1>
            <div className="gold-line mx-auto mb-6" />
            <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg">
              Explore our bespoke {categoryName.toLowerCase()} solutions, built with premium materials and custom design specifications.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="container-custom section-padding pb-24">
          <SectionReveal className="text-center mb-12">
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-semibold">Our Portfolio</span>
            <h2 className="section-title mt-3">{categoryName} Designs</h2>
            <div className="gold-line mx-auto mt-4" />
          </SectionReveal>

          {/* Subcategory Filters */}
          {subcategories.length > 1 && (
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
          )}

          {/* Project Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((project, i) => (
                  <SectionReveal key={project._id} delay={i * 0.08}>
                    <Link href={`/projects/${project.slug}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100 h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={project.images?.[0]?.url || '/placeholder.jpg'}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-gold text-xs font-semibold tracking-wider uppercase mb-2 block">
                              {project.subcategory || categoryName}
                            </span>
                            <h3 className="font-heading text-lg font-bold text-charcoal mb-3 group-hover:text-gold transition-colors duration-300">
                              {project.title}
                            </h3>
                            <p className="text-silver text-sm line-clamp-3 leading-relaxed mb-4">
                              {project.description}
                            </p>
                          </div>
                          <span className="text-gold text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300 mt-2">
                            View Case Study &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SectionReveal>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-silver">
                  No designs found in this category.
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
