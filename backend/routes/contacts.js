const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/contacts - Public: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message, service } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and message are required'
      });
    }

    const contact = await Contact.create({
      name, phone, email, message, service
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts - Admin: Get all contacts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    const query = {};
    
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/contacts/:id/read - Admin: Mark as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/contacts/:id - Admin: Delete contact
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts/export/csv - Admin: Export as CSV
router.get('/export/csv', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt').lean();
    
    const { Parser } = require('json2csv');
    const fields = ['name', 'phone', 'email', 'message', 'service', 'isRead', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(contacts);

    res.header('Content-Type', 'text/csv');
    res.attachment('contacts-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
