const express = require('express');
const { v4: uuidv4 } = require('uuid');
const EmailService = require('../services/email');
const ShopifyService = require('../services/shopify');
const SecurityUtils = require('../utils/security');

const router = express.Router();
const emailService = new EmailService();
const shopifyService = new ShopifyService();

/**
 * POST /api/email/collect
 * Collect email for download gating
 * 
 * Body:
 * {
 *   "email": "user@example.com",
 *   "platform": "windows",
 *   "version": "0.9.4",
 *   "userAgent": "Mozilla/5.0...",
 *   "referrer": "https://mixfade.app"
 * }
 */
router.post('/collect', async (req, res) => {
  try {
    const { email, platform = 'windows', version, userAgent, referrer } = req.body;

    // Enhanced email validation with security checks
    const emailValidation = emailService.validateEmail(email);
    if (!emailValidation.isValid) {
      console.warn(`Invalid email attempt from IP ${req.ip}: ${SecurityUtils.sanitizeLogData(emailValidation.errors)}`);
      return res.status(400).json({
        success: false,
        error: emailValidation.errors[0] || 'Invalid email address'
      });
    }

    // Sanitize and validate other inputs
    const sanitizedEmail = emailValidation.sanitized;
    const sanitizedPlatform = SecurityUtils.validatePlatform(platform);
    const sanitizedVersion = SecurityUtils.validateVersion(version);
    const sanitizedUserAgent = SecurityUtils.sanitizeInput(userAgent || '');
    const sanitizedReferrer = SecurityUtils.sanitizeInput(referrer || '');

    // Generate session ID for tracking
    const sessionId = uuidv4();
    
    console.log(`📧 Email collection request: ${sanitizedEmail} for ${sanitizedPlatform} v${sanitizedVersion}`);

    // Add email to Shopify mailing list
    let mailingListResult;
    try {
      mailingListResult = await shopifyService.collectEmailForMailingList(sanitizedEmail, {
        platform: sanitizedPlatform,
        version: sanitizedVersion,
        userAgent: sanitizedUserAgent,
        referrer: sanitizedReferrer,
        sessionId
      });
    } catch (shopifyError) {
      console.error('Shopify mailing list error:', SecurityUtils.sanitizeLogData(shopifyError.message));
      // Continue even if Shopify fails - don't block downloads
      mailingListResult = { 
        action: 'error',
        error: 'Mailing list service temporarily unavailable' 
      };
    }

    // Log the email collection with sanitized data
    const emailLogEntry = {
      email: sanitizedEmail,
      platform: sanitizedPlatform,
      version: sanitizedVersion,
      userAgent: sanitizedUserAgent.substring(0, 200), // Limit length
      referrer: sanitizedReferrer.substring(0, 200), // Limit length
      sessionId,
      timestamp: new Date().toISOString(),
      mailingListResult,
      ip: req.ip || req.connection.remoteAddress
    };

    console.log('📧 Email collected for mailing list:', SecurityUtils.sanitizeLogData(emailLogEntry));

    // Return success response
    const responseMessage = mailingListResult.action === 'created' 
      ? 'Welcome! You\'ve been added to our mailing list. Your download is ready!'
      : mailingListResult.action === 'updated'
      ? 'Welcome back! You\'re now subscribed to updates. Your download is ready!'
      : 'Welcome back! Your download is ready.';

    res.status(200).json({
      success: true,
      sessionId,
      message: responseMessage,
      customer: {
        exists: mailingListResult.action === 'exists',
        added: mailingListResult.action === 'created',
        subscribed: mailingListResult.nowSubscribed
      }
    });

  } catch (error) {
    console.error('Email collection error:', SecurityUtils.sanitizeLogData(error.message));
    res.status(500).json({ 
      error: 'Failed to process email. Please try again.' 
    });
  }
});

/**
 * POST /api/email/validate
 * Quick email validation endpoint
 */
router.post('/validate', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const isValid = emailService.isValidEmail(email);
    
    res.json({ 
      valid: isValid,
      email: email.toLowerCase().trim()
    });

  } catch (error) {
    console.error('Email validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

/**
 * GET /api/email/stats
 * Get collection statistics (for admin/analytics)
 */
router.get('/stats', (req, res) => {
  // This would typically require authentication
  // For now, return basic stats
  res.json({
    message: 'Email collection stats',
    note: 'This endpoint would show analytics in a full implementation'
  });
});

module.exports = router;