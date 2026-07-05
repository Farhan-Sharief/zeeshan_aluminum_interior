const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const PORT = process.env.PORT || 5000;

// Initialize Next.js app
const nextApp = next({ dev, hostname, port: PORT });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // Security middleware (Disable contentSecurityPolicy to avoid blocking Next.js dev scripts)
  app.use(helmet({ contentSecurityPolicy: false }));
  app.set('trust proxy', 1); // Required when behind reverse proxy (Render, Railway, etc.)

  // Logging — combined in production, dev in development
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Rate limiting for API routes
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);

  // CORS
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5000')
    .split(',')
    .map(o => o.trim());

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  const authRoutes = require('./routes/auth');
  const projectRoutes = require('./routes/projects');
  const categoryRoutes = require('./routes/categories');
  const testimonialRoutes = require('./routes/testimonials');
  const contactRoutes = require('./routes/contacts');
  const statsRoutes = require('./routes/stats');
  const uploadRoutes = require('./routes/upload');

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/upload', uploadRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
  });

  // Next.js handler for all other routes
  app.all('{*path}', (req, res) => {
    return handle(req, res);
  });

  // Global error handling middleware (mostly for API routes)
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // Database connection & server start
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('✅ MongoDB connected successfully');
      
      // Run category migration
      try {
        const runCategoryMigration = require('./lib/dbMigration');
        await runCategoryMigration();
      } catch (migrationError) {
        console.error('❌ Failed to run startup category migration:', migrationError);
      }

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1);
    });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
