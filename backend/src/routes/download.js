const express = require('express');
const { v4: uuidv4 } = require('uuid');
const SecurityUtils = require('../utils/security');

const router = express.Router();

/**
 * POST /api/download/track
 * Track download events for analytics
 * 
 * Body:
 * {
 *   "sessionId": "uuid-from-email-collection",
 *   "platform": "windows",
 *   "version": "0.9.4",
 *   "filename": "MixFade Setup 0.9.4.exe",
 *   "downloadUrl": "https://...",
 *   "userAgent": "Mozilla/5.0...",
 *   "referrer": "https://mixfade.app/download"
 * }
 */
router.post('/track', async (req, res) => {
  try {
    const { 
      sessionId, 
      platform = 'windows', 
      version, 
      filename, 
      downloadUrl,
      userAgent, 
      referrer 
    } = req.body;

    // Sanitize and validate inputs
    const sanitizedSessionId = SecurityUtils.sanitizeInput(sessionId || 'unknown');
    const sanitizedPlatform = SecurityUtils.validatePlatform(platform);
    const sanitizedVersion = SecurityUtils.validateVersion(version);
    const sanitizedFilename = SecurityUtils.sanitizeInput(filename || '');
    const sanitizedDownloadUrl = SecurityUtils.sanitizeInput(downloadUrl || '');
    const sanitizedUserAgent = SecurityUtils.sanitizeInput(userAgent || '').substring(0, 200);
    const sanitizedReferrer = SecurityUtils.sanitizeInput(referrer || '').substring(0, 200);

    // Create download tracking entry
    const downloadEvent = {
      downloadId: uuidv4(),
      sessionId: sanitizedSessionId,
      platform: sanitizedPlatform,
      version: sanitizedVersion,
      filename: sanitizedFilename,
      downloadUrl: sanitizedDownloadUrl,
      userAgent: sanitizedUserAgent,
      referrer: sanitizedReferrer,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      success: true
    };

    console.log('📥 Download tracked:', SecurityUtils.sanitizeLogData(downloadEvent));

    // In a full implementation, you'd store this in a database
    // For now, we'll just log it
    
    res.status(200).json({
      success: true,
      downloadId: downloadEvent.downloadId,
      message: 'Download tracked successfully'
    });

  } catch (error) {
    console.error('Download tracking error:', SecurityUtils.sanitizeLogData(error.message));
    res.status(500).json({ 
      error: 'Failed to track download' 
    });
  }
});

/**
 * POST /api/download/error
 * Track download errors for debugging
 */
router.post('/error', async (req, res) => {
  try {
    const { 
      sessionId, 
      platform, 
      version, 
      error: downloadError,
      userAgent, 
      referrer 
    } = req.body;

    // Sanitize and validate inputs
    const sanitizedSessionId = SecurityUtils.sanitizeInput(sessionId || 'unknown');
    const sanitizedPlatform = SecurityUtils.validatePlatform(platform);
    const sanitizedVersion = SecurityUtils.validateVersion(version);
    const sanitizedError = SecurityUtils.sanitizeInput(downloadError || '').substring(0, 500);
    const sanitizedUserAgent = SecurityUtils.sanitizeInput(userAgent || '').substring(0, 200);
    const sanitizedReferrer = SecurityUtils.sanitizeInput(referrer || '').substring(0, 200);

    const errorEvent = {
      errorId: uuidv4(),
      sessionId: sanitizedSessionId,
      platform: sanitizedPlatform,
      version: sanitizedVersion,
      error: sanitizedError,
      userAgent: sanitizedUserAgent,
      referrer: sanitizedReferrer,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };

    console.error('❌ Download error tracked:', SecurityUtils.sanitizeLogData(errorEvent));

    res.status(200).json({
      success: true,
      errorId: errorEvent.errorId,
      message: 'Error tracked successfully'
    });

  } catch (error) {
    console.error('Download error tracking failed:', SecurityUtils.sanitizeLogData(error.message));
    res.status(500).json({ 
      error: 'Failed to track download error' 
    });
  }
});

/**
 * GET /api/download/stats
 * Get download statistics (for admin/analytics)
 */
router.get('/stats', (req, res) => {
  // This would typically require authentication
  res.json({
    message: 'Download statistics',
    note: 'This endpoint would show download analytics in a full implementation',
    endpoints: [
      'POST /api/download/track - Track successful downloads',
      'POST /api/download/error - Track download errors'
    ]
  });
});

module.exports = router;