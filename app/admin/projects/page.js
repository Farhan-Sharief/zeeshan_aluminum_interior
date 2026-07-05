'use client';
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminProjects, createProject, updateProject, deleteProject, uploadMultipleImages, deleteImage, getCategories } from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiPhoto, HiOutlineCloudUpload, HiX } from 'react-icons/hi';
import Image from 'next/image';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TV Cabinet');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState([]); // Array of { url, publicId }

  // Category States
  const [allCategories, setAllCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getAdminProjects({ limit: 100 });
      if (res.data?.success) {
        setProjects(res.data.data);
      }
    } catch {
      toast.error('Failed to load projects from server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data?.success) {
        setAllCategories(res.data.data);
      }
    } catch {
      toast.error('Failed to load categories.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory(allCategories[0] || 'TV Cabinet');
    setSubcategory('');
    setDescription('');
    setMaterials('');
    setCompletionDate('');
    setFeatured(false);
    setImages([]);
    setEditingId(null);
    setUploadProgress(0);
    setIsNewCategory(false);
    setNewCategoryName('');
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setSubcategory(project.subcategory || '');
    setDescription(project.description);
    setMaterials(project.materials || '');
    setCompletionDate(project.completionDate ? project.completionDate.split('T')[0] : '');
    setFeatured(project.featured || false);
    setImages(project.images || []);
    setIsNewCategory(false);
    setNewCategoryName('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This will permanently remove all associated images.')) return;
    try {
      const res = await deleteProject(id);
      if (res.data?.success) {
        toast.success('Project deleted successfully.');
        fetchProjects();
      }
    } catch {
      toast.error('Error deleting project.');
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    setUploading(true);
    setUploadProgress(20);
    try {
      const res = await uploadMultipleImages(formData);
      setUploadProgress(80);
      if (res.data?.success) {
        const newImgs = res.data.data.map(img => ({
          url: img.url,
          publicId: img.publicId,
          alt: '',
          isBefore: false
        }));
        setImages(prev => [...prev, ...newImgs]);
        toast.success(`${files.length} images uploaded successfully.`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed. Please check your Cloudinary configuration.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async (index, publicId) => {
    // If it's a mock local URL, just filter it out
    if (publicId.startsWith('mock-id')) {
      setImages(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await deleteImage(publicId);
      setImages(prev => prev.filter((_, i) => i !== index));
      toast.success('Image removed.');
    } catch {
      setImages(prev => prev.filter((_, i) => i !== index)); // Filter anyway for smoothness
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || images.length === 0) {
      toast.error('Title, description, and at least one image are required.');
      return;
    }

    const payload = {
      title,
      category,
      subcategory,
      description,
      materials,
      completionDate: completionDate || undefined,
      featured,
      images
    };

    try {
      let res;
      if (editingId) {
        res = await updateProject(editingId, payload);
        if (res.data?.success) toast.success('Project updated successfully.');
      } else {
        res = await createProject(payload);
        if (res.data?.success) toast.success('Project created successfully.');
      }
      setShowModal(false);
      resetForm();
      fetchProjects();
      fetchCategories();
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err?.response?.data?.message || 'Failed to save project. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal">Manage Projects</h1>
            <p className="text-silver text-sm">Add, update, or remove portfolio showcase designs</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <HiPlus size={18} />
            Add New Project
          </button>
        </div>

        {/* Projects Table List */}
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-gray-100 text-silver text-xs uppercase tracking-wider font-semibold">
                    <th className="p-4 pl-6">Design Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-charcoal/80">
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200">
                          <Image
                            src={proj.images?.[0]?.url || '/placeholder.jpg'}
                            alt={proj.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-charcoal truncate max-w-[200px]">{proj.title}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs">
                          {proj.category}
                        </span>
                      </td>
                      <td className="p-4">
                        {proj.featured ? (
                          <span className="text-gold font-semibold text-xs">Yes</span>
                        ) : (
                          <span className="text-silver text-xs">No</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-silver">
                        {proj.completionDate ? new Date(proj.completionDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short'
                        }) : 'N/A'}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(proj)}
                          className="p-2 text-zinc-500 hover:text-gold hover:bg-zinc-100 rounded transition-colors"
                          aria-label="Edit project"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-100 rounded transition-colors"
                          aria-label="Delete project"
                        >
                          <HiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12 text-silver text-sm">
                No designs uploaded yet. Click &ldquo;Add New Project&rdquo; to start.
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Project Dialog Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-heading text-xl font-bold text-charcoal">
                  {editingId ? 'Edit Project Design' : 'Add New Portfolio Design'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-silver hover:text-charcoal p-1 rounded"
                >
                  <HiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Minimalist TV Unit"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Main Category *</label>
                    <select
                      value={isNewCategory ? 'NEW' : category}
                      onChange={(e) => {
                        if (e.target.value === 'NEW') {
                          setIsNewCategory(true);
                          setCategory('');
                        } else {
                          setIsNewCategory(false);
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm text-charcoal/80"
                    >
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="NEW">+ Create New Category...</option>
                    </select>

                    {isNewCategory && (
                      <div className="mt-3">
                        <input
                          type="text"
                          required
                          value={newCategoryName}
                          onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            setCategory(e.target.value);
                          }}
                          placeholder="Enter new category name..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Subcategory Style</label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Modern / Windows"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Completion Date</label>
                    <input
                      type="date"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm text-charcoal/70"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-gold focus:ring-gold"
                      />
                      <span className="text-xs uppercase tracking-wider text-silver font-semibold">Featured Showcase</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Materials & Specs (Optional)</label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Glossy MDF Panels, Soft LEDs, Aluminum Alloy"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-silver mb-2 font-medium">Project Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe design features, sizing, planning, work scope..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold/50 text-sm"
                  />
                </div>

                {/* Cloudinary drag and drop image section */}
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-wider text-silver font-medium">Project Images *</label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-gold/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-zinc-50"
                  >
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineCloudUpload className="text-silver" size={40} />
                      <span className="text-sm font-semibold text-charcoal">Drag & Drop or Click to Upload</span>
                      <span className="text-xs text-silver">Supports PNG, JPG up to 10MB</span>
                    </div>
                  </div>

                  {/* Upload progress indicator */}
                  {uploading && (
                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gold h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Uploaded images list */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                          <Image
                            src={img.url}
                            alt="Uploaded preview"
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx, img.publicId)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow shadow-black/25"
                            aria-label="Remove image"
                          >
                            <HiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 rounded border border-gray-200 text-charcoal/80 text-sm hover:bg-zinc-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingId ? 'Save Changes' : 'Publish Design'}
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
