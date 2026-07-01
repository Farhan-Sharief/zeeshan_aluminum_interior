const express = require('express');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [totalProjects, totalTestimonials, totalContacts, unreadContacts, featuredProjects, recentProjects, recentContacts] = await Promise.all([
      Project.countDocuments(),
      Testimonial.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Project.countDocuments({ featured: true }),
      Project.find().sort('-createdAt').limit(5).select('title category images createdAt'),
      Contact.find().sort('-createdAt').limit(5).select('name phone message createdAt isRead')
    ]);

    const totalImages = await Project.aggregate([
      { $project: { imageCount: { $size: { $ifNull: ['$images', []] } } } },
      { $group: { _id: null, total: { $sum: '$imageCount' } } }
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyInquiries = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyProjects = await Project.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const categoryStats = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { totalProjects, totalImages: totalImages[0]?.total || 0, totalTestimonials, totalContacts, unreadContacts, featuredProjects, recentProjects, recentContacts, monthlyInquiries, monthlyProjects, categoryStats }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
