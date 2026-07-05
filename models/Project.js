const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    isBefore: { type: Boolean, default: false } // For before/after comparisons
  }],
  materials: {
    type: String,
    trim: true
  },
  completionDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  tags: [String],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-generate slug from title
projectSchema.pre('save', function() {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
});

// Indexes
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
