require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const SecurityMonitor = require('./middleware/security-monitor');

// Import routes with error handling
let emailRoutes, downloadRoutes, docsRoutes;
try {
  emailRoutes = require('./routes/email');
  downloadRoutes = require('./routes/download');
  docsRoutes = require('./routes/docs');
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Initialize security monitor
const securityMonitor = new SecurityMonitor();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Railway deployment (fixes X-Forwarded-For header validation)
// Railway uses a reverse proxy, so we need to trust the first proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Dynamic CORS configuration to support multiple origins
const getAllowedOrigins = () => {
  const origins = [];
  
  // Add environment-specific frontend URL
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
    console.log('🌍 CORS: Added FRONTEND_URL from environment:', process.env.FRONTEND_URL);
  }
  
  // Always include these origins for production and development
  origins.push(
    'https://mixfade.com',
    'https://mixfade-frontend-production.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080'
  );
  
  // Remove duplicates
  const uniqueOrigins = [...new Set(origins)];
  console.log('🌍 CORS: Allowed origins configured:', uniqueOrigins);
  return uniqueOrigins;
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
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

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware to handle CORS headers explicitly
app.use((req, res, next) => {
  // Set CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (allowedOrigins.includes(origin)) { 
    res.header('Access-Control-Allow-Origin', origin); 
  }
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// API routes
app.use('/api/email', emailRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/docs', docsRoutes);

// Root endpoint with debugging info
app.get('/', (req, res) => {
  console.log(`📝 Root request from ${req.headers.origin || 'no-origin'}`);
  res.json({ 
    message: 'MixFade Landing Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health',
      'GET /api/health',
      'POST /api/email/collect',
      'POST /api/download/track',
      'GET /api/docs/content',
      'GET /api/docs/structure',
      'GET /api/docs/search',
      'GET /security/stats'
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

// Start server - KEEP BINDING TO 0.0.0.0 for Railway
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Listening on: 0.0.0.0:${PORT}`);
  console.log(`✅ Started at: ${new Date().toISOString()}`);
  console.log('Health check endpoints available at:');
  console.log('  - /health');
  console.log('  - /api/health');
  console.log('\n📋 Available endpoints:');
  console.log('  - GET  / (API documentation)');
  console.log('  - GET  /health (Health check)');
  console.log('  - GET  /api/health (API health check)');
  console.log('  - POST /api/email/collect (Email collection)');
  console.log('  - POST /api/email/validate (Email validation)');
  console.log('  - GET  /api/email/stats (Email statistics)');
  console.log('  - GET  /api/docs/content (Documentation content)');
  console.log('  - GET  /api/docs/structure (Documentation structure)');
  console.log('  - GET  /api/docs/search (Documentation search)');
  console.log('  - GET  /security/stats (Security statistics)');
});

server.on('error', (error) => {
  console.error('❌ Server startup error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
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