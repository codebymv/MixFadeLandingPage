require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const SecurityMonitor = require('./middleware/security-monitor');

// Import routes with error handling
let emailRoutes, downloadRoutes;
try {
  emailRoutes = require('./routes/email');
  downloadRoutes = require('./routes/download');
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Initialize security monitor
const securityMonitor = new SecurityMonitor();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mixfade.app', 'https://www.mixfade.app', /\.up\.railway\.app$/] // Allow Railway domains
    : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// More restrictive rate limiting for email collection
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 email submissions per windowMs
  message: 'Too many email submissions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests, only count failed ones
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`);
    res.status(429).json({
      error: 'Too many email submissions from this IP, please try again later.'
    });
  }
});

// Additional security middleware for request size limits
const requestSizeLimiter = (req, res, next) => {
  const maxSize = 1024 * 10; // 10KB max request size
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return res.status(413).json({ error: 'Request too large' });
  }
  next();
};

// Security monitoring (before other middleware)
app.use(securityMonitor.monitor());

// Body parsing middleware with security limits
app.use(requestSizeLimiter);
app.use(express.json({ limit: '10kb' })); // Reduced from 10mb to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MixFade Landing Backend'
  });
});

// API health check endpoint (for frontend compatibility)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MixFade Landing Backend API'
  });
});

// Security stats endpoint (basic monitoring)
app.get('/security/stats', (req, res) => {
  try {
    const stats = securityMonitor.getStats();
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security stats'
    });
  }
});

// API routes
app.use('/api/email', emailLimiter, emailRoutes);
app.use('/api/download', downloadRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MixFade Landing Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'POST /api/email/collect',
      'POST /api/download/track'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server - CRITICAL: Bind to 0.0.0.0 for Railway deployment
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MixFade Landing Backend running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email collection available at /api/email/collect`);
  console.log(`📥 Download tracking available at /api/download/track`);
  console.log(`🔒 Security monitoring active`);
  console.log(`🌐 Server bound to 0.0.0.0 for Railway compatibility`);
  console.log(`✅ Server startup completed successfully`);
});

// Handle server startup errors
server.on('error', (error) => {
  console.error('❌ Server startup error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🔒 Shutting down security monitor...');
  securityMonitor.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔒 Shutting down security monitor...');
  securityMonitor.destroy();
  process.exit(0);
});