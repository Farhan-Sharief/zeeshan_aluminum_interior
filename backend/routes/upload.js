const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/upload/single - Upload single image
router.post('/single', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'zeeshan-al-int',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1920, crop: 'limit' }
      ]
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', authMiddleware, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'zeeshan-al-int',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1920, crop: 'limit' }
        ]
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      };
    });

    const results = await Promise.all(uploadPromises);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// DELETE /api/upload - Delete image from Cloudinary
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const publicId = req.query.publicId || req.body.publicId;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = router;
