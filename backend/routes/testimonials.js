const express = require('express');
const Testimonial = require('../models/Testimonial');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// GET /api/testimonials - Public: Get active testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort('-createdAt')
      .select('-__v');
    
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/testimonials/admin/all - Admin: Get all testimonials
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Admin get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/testimonials - Admin: Create testimonial
router.post('/', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Create testimonial error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/testimonials/:id - Admin: Update testimonial
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/testimonials/:id - Admin: Delete testimonial
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (testimonial.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(testimonial.image.publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
