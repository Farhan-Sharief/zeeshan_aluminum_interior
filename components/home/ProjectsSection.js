'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionReveal from '../SectionReveal';
import SkeletonCard from '../SkeletonCard';
import { HiArrowRight } from 'react-icons/hi';
import { getFeaturedProjects, getCategories } from '@/lib/api';

const fallbackProjects = [
  { _id: '1', title: 'Minimalist TV Panel', slug: 'modern-living-room-tv-unit', category: 'TV Cabinet', images: [{ url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&q=80' }], description: 'Seamless media integration with high-gloss acoustic panels.' },
  { _id: '2', title: 'Panoramic Sliding Frames', slug: 'aluminum-sliding-windows', category: 'Aluminum Work', images: [{ url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80' }], description: 'Ultra-slim profile thermal-broken aluminum sliding systems.' },
  { _id: '3', title: 'Culinary Elegance', slug: 'contemporary-kitchen', category: 'Interior Work', images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' }], description: 'Italian matte finish modular kitchen with smart ergonomics.' },
  { _id: '4', title: 'Walk-In Grandeur', slug: 'luxury-bedroom-wardrobe', category: 'Interior Work', images: [{ url: 'https://images.unsplash.com/photo-1616137466211-f736a1358f7e?w=800&q=80' }], description: 'Floor-to-ceiling glass wardrobes with sensor-activated ambient lighting.' },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All', 'TV Cabinet', 'Aluminum Work', 'Interior Work']);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProjectsAndCategories = async () => {
      try {
        const [projRes, catRes] = await Promise.allSettled([
          getFeaturedProjects(),
          getCategories()
        ]);

        if (projRes.status === 'fulfilled' && projRes.value.data?.data?.length > 0) {
          setProjects(projRes.value.data.data.slice(0, 4));
        } else {
          setProjects(fallbackProjects);
        }

        if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
          setCategories(['All', ...catRes.value.data.data]);
        }
      } catch (err) {
        console.error('Error fetching projects and categories:', err);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsAndCategories();
  }, []);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-cream" id="projects">
      <div className="container-custom">
        <SectionReveal className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20">
          <div className="max-w-2xl">
            <span className="text-gold text-xs tracking-[0.3em] font-medium uppercase mb-4 block">
              Curated Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-charcoal font-light leading-tight">
              Featured <br />
              <span className="text-gold italic font-serif">Commissions</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 mt-8 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'text-gold border-b border-gold pb-1'
                    : 'text-silver hover:text-charcoal pb-1 border-b border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SectionReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-y-24">
            {filtered.map((project, i) => (
              <SectionReveal key={project._id} delay={i * 0.1}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className={`overflow-hidden ${i % 2 !== 0 ? 'md:mt-24' : ''}`}>
                    <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-charcoal">
                      <Image
                        src={project.images?.[0]?.url || '/placeholder.jpg'}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    
                    <div className="pt-8 flex justify-between items-start">
                      <div>
                        <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold block mb-2">
                          {project.category}
                        </span>
                        <h3 className="font-heading text-2xl md:text-3xl font-light text-charcoal group-hover:text-gold transition-colors duration-300">
                          {project.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-charcoal group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <HiArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        )}

        <SectionReveal className="text-center mt-24">
          <Link href="/interior-work" className="group relative inline-flex items-center justify-center px-8 py-4 border border-charcoal/20 text-charcoal font-medium text-sm tracking-widest uppercase overflow-hidden transition-all hover:border-charcoal hover:bg-charcoal hover:text-white">
            <span className="relative z-10 flex items-center gap-3">
              Discover All Works
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
