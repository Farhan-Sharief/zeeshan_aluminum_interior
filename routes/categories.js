const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const normalizeCategoryName = require('../lib/normalizeCategory');
const router = express.Router();

// GET /api/categories - Public: Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories.map(c => c.name) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/categories - Admin: Create category manually
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const normalized = normalizeCategoryName(name);

    let category = await Category.findOne({ name: normalized });
    if (category) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    category = await Category.create({ name: normalized });
    res.status(201).json({ success: true, data: category.name });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
