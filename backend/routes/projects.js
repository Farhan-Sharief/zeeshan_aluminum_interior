const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// GET /api/projects - Public: Get all published projects
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      limit = 20, 
      page = 1,
      search,
      sort = '-createdAt'
    } = req.query;

    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);
    
    const projects = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/projects/featured - Public: Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, status: 'published' })
      .sort('-createdAt')
      .limit(8)
      .select('-__v');

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/projects/:slug - Public: Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      slug: req.params.slug,
      status: 'published' 
    }).select('-__v');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get related projects
    const related = await Project.find({
      category: project.category,
      _id: { $ne: project._id },
      status: 'published'
    })
      .sort('-createdAt')
      .limit(4)
      .select('title slug images category');

    res.json({ success: true, data: project, related });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/projects - Admin: Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/projects/admin/all - Admin: Get all projects (including drafts)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Admin get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/projects/:id - Admin: Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/projects/:id - Admin: Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete images from Cloudinary
    for (const image of project.images) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
