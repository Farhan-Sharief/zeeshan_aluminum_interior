'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import SectionReveal from '@/components/SectionReveal';
import { getProject } from '@/lib/api';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const fallbackProjects = {
  'modern-living-room-tv-unit': {
    title: 'Modern Living Room TV Unit',
    category: 'TV Cabinet',
    subcategory: 'Modern',
    description: 'This projects showcases our expertise in designing modern TV units. We used high-gloss acrylic sheets combined with premium warm wood laminate. The back panel incorporates custom lighting that illuminates the quartz marble slab background. Smart cable routing ensures all power wires and device connections remain completely invisible.',
    materials: 'High-Gloss Acrylic Sheets, Quartz Slab Backdrop, Warm LED Stripes, Blum Soft Close Fittings',
    completionDate: '2024-03-15',
    images: [
      { url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80' },
      { url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80' },
    ],
    related: [
      { title: 'Classic Walnut TV Unit', slug: 'classic-walnut-gold-tv-console', category: 'TV Cabinet', images: [{ url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' }] },
      { title: 'Minimalist TV Panel', slug: 'minimalist-charcoal-tv-unit', category: 'TV Cabinet', images: [{ url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&q=80' }] }
    ]
  }
};

export default function ProjectDetailsPage({ params }) {
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // We should unwrap params correctly or use params.slug (Next.js 14 app directory params).
  // Next 14 handles params directly but params can be a promise in Next 15. Since this is create-next-app (which installs latest - usually Next 15), we can handle params using React.use() or just wait/unwrap. But to be safe for both, we can just access it.
  const [slug, setSlug] = useState('');

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      if (resolvedParams?.slug) {
        setSlug(resolvedParams.slug);
      }
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const fetchProjectDetails = async () => {
      try {
        const res = await getProject(slug);
        if (res.data?.success) {
          setProject(res.data.data);
          setRelated(res.data.related || []);
        } else {
          loadFallback();
        }
      } catch {
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const fallback = fallbackProjects[slug] || Object.values(fallbackProjects)[0];
      setProject(fallback);
      setRelated(fallback?.related || []);
    };

    fetchProjectDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-silver">
        Project not found.
      </div>
    );
  }

  const slides = project.images?.map(img => ({ src: img.url })) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Banner Section */}
        <section className="relative pt-32 pb-16 bg-charcoal text-white text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${project.images?.[0]?.url || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'})` }} />
          <div className="relative z-10 container-custom">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{project.title}</h1>
            <div className="gold-line mx-auto mb-4" />
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Breadcrumb */}
          <div className="text-xs text-silver uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal/70">{project.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gold">{project.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Gallery (Left/Main - Columns span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal">{project.title}</h1>
              <div className="gold-line mb-8" />

              {/* Main Large Image */}
              {project.images?.[0] && (
                <div
                  className="relative aspect-[16/10] w-full rounded-xl overflow-hidden shadow-md cursor-zoom-in border border-gray-100"
                  onClick={() => setLightboxIndex(0)}
                >
                  <Image
                    src={project.images[0].url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Thumbnail Gallery Grid */}
              {project.images && project.images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in hover:opacity-95 transition-opacity border border-gray-200"
                      onClick={() => setLightboxIndex(index + 1)}
                    >
                      <Image
                        src={image.url}
                        alt={`${project.title} gallery ${index + 2}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Sidebar (Right) */}
            <div className="lg:col-span-1 bg-white rounded-xl p-8 border border-gray-100 shadow-sm h-fit space-y-6">
              <h3 className="font-heading text-xl font-bold text-charcoal pb-4 border-b border-gray-100">Project Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-silver">Category</span>
                  <span className="text-sm font-semibold text-charcoal/80">{project.category}</span>
                </div>
                {project.subcategory && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Design Style</span>
                    <span className="text-sm font-semibold text-charcoal/80">{project.subcategory}</span>
                  </div>
                )}
                {project.materials && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Materials & Specs</span>
                    <span className="text-sm font-semibold text-charcoal/80 leading-relaxed block">{project.materials}</span>
                  </div>
                )}
                {project.completionDate && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-silver">Completion Date</span>
                    <span className="text-sm font-semibold text-charcoal/80">
                      {new Date(project.completionDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-silver text-sm leading-relaxed mb-6">{project.description}</p>
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Inquire About This Design
                </Link>
              </div>
            </div>
          </div>

          {/* Related Projects Section */}
          {related && related.length > 0 && (
            <div className="mt-20">
              <h3 className="font-heading text-2xl font-bold text-charcoal mb-8">Related Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((item) => (
                  <Link href={`/projects/${item.slug}`} key={item.slug}>
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={item.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-heading text-sm font-semibold text-charcoal group-hover:text-gold transition-colors truncate">{item.title}</h4>
                        <span className="text-xs text-gold uppercase tracking-wider mt-1 block">{item.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox for large view */}
      <Lightbox
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />

      <Footer />
      <FloatingButtons />
    </>
  );
}
