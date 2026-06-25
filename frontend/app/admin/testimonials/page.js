'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, uploadImage, deleteImage } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiStar, HiX } from 'react-icons/hi';
import Image from 'next/image';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [designation, setDesignation] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState({ url: '', publicId: '' });

  // Upload States
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getAdminTestimonials();
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch {
      toast.error('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTestimonials();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setClientName('');
    setDesignation('');
    setReview('');
    setRating(5);
    setImage({ url: '', publicId: '' });
    setEditingId(null);
  };

  const handleEdit = (testi) => {
    setEditingId(testi._id);
    setClientName(testi.clientName);
    setDesignation(testi.designation || '');
    setReview(testi.review);
    setRating(testi.rating);
    setImage(testi.image || { url: '', publicId: '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await deleteTestimonial(id);
      if (res.data?.success) {
        toast.success('Testimonial deleted.');
        fetchTestimonials();
      }
    } catch {
      toast.error('Error deleting testimonial.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await uploadImage(formData);
      if (res.data?.success) {
        setImage({
          url: res.data.data.url,
          publicId: res.data.data.publicId
        });
        toast.success('Client photo uploaded.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Image upload failed. Please check your Cloudinary configuration.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (image.publicId && !image.publicId.startsWith('mock-avatar')) {
      try {
        await deleteImage(image.publicId);
      } catch (err) {
        console.error('Delete error', err);
      }
    }
    setImage({ url: '', publicId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !review) {
      toast.error('Client name and review text are required.');
      return;
    }

    const payload = {
      clientName,
      designation,
      review,
      rating: parseInt(rating),
      image
    };

    try {
      let res;
      if (editingId) {
        res = await updateTestimonial(editingId, payload);
        if (res.data?.success) toast.success('Testimonial updated.');
      } else {
        res = await createTestimonial(payload);
        if (res.data?.success) toast.success('Testimonial created.');
      }
      setShowModal(false);
      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to save testimonial. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal">Manage Testimonials</h1>
            <p className="text-silver text-sm">Add or edit client testimonials shown on the website</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <HiPlus size={18} />
            Add Testimonial
          </button>
        </div>

        {/* Testimonials list */}
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testi) => (
              <div key={testi._id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex text-gold">
                    {[...Array(testi.rating)].map((_, i) => (
                      <HiStar key={i} size={16} />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-silver italic leading-relaxed line-clamp-4">&ldquo;{testi.review}&rdquo;</p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={testi.image?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt={testi.clientName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="block font-semibold text-sm text-charcoal">{testi.clientName}</span>
                      <span className="text-xs text-silver">{testi.designation || 'Client'}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(testi)}
                      className="p-1.5 text-zinc-500 hover:text-gold hover:bg-zinc-50 rounded transition-colors"
                      aria-label="Edit review"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(testi._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-50 rounded transition-colors"
                      aria-label="Delete review"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {testimonials.length === 0 && (
              <div className="text-center py-12 text-silver text-sm col-span-full">
                No reviews added yet.
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-heading text-xl font-bold text-charcoal">
                  {editingId ? 'Edit Testimonial' : 'Add Client Review'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-silver hover:text-charcoal p-1">
                  <HiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Client Title</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Homeowner"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Rating Score *</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm text-charcoal/80"
                    >
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Client Photo</label>
                    {image.url ? (
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                          <Image src={image.url} alt="Reviewer Avatar" fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="avatar-input"
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => document.getElementById('avatar-input')?.click()}
                          className="px-3 py-2 bg-zinc-100 text-charcoal/80 hover:bg-zinc-200 rounded text-xs font-semibold"
                        >
                          {uploading ? 'Uploading...' : 'Choose Photo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Review Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Enter what the client said about your work..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded border border-gray-200 text-charcoal/80 text-sm hover:bg-zinc-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
