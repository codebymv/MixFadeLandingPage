const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create DOMPurify instance for server-side use
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Security utilities for input validation and sanitization
 */
class SecurityUtils {
  /**
   * Sanitize string input to prevent injection attacks
   * @param {string} input - The input string to sanitize
   * @param {object} options - Sanitization options
   * @returns {string} - Sanitized string
   */
  static sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') {
      return '';
    }

    // Basic HTML sanitization
    let sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [],
      ...options
    });

    // Additional sanitization for common injection patterns
    sanitized = sanitized
      .replace(/[<>"']/g, '') // Remove potentially dangerous characters
      .trim();

    return sanitized;
  }

  /**
   * Enhanced email validation with additional security checks
   * @param {string} email - Email to validate
   * @returns {object} - Validation result with details
   */
  static validateEmail(email) {
    const result = {
      isValid: false,
      sanitized: '',
      errors: []
    };

    if (!email || typeof email !== 'string') {
      result.errors.push('Email is required');
      return result;
    }

    // Sanitize the email first
    const sanitized = this.sanitizeInput(email.toLowerCase().trim());
    result.sanitized = sanitized;

    // Length validation
    if (sanitized.length > 254) {
      result.errors.push('Email address is too long');
      return result;
    }

    if (sanitized.length < 5) {
      result.errors.push('Email address is too short');
      return result;
    }

    // Format validation using validator.js
    if (!validator.isEmail(sanitized)) {
      result.errors.push('Invalid email format');
      return result;
    }

    // Additional security checks
    const suspiciousPatterns = [
      /[<>"']/,  // HTML/script injection attempts
      /javascript:/i,  // JavaScript protocol
      /data:/i,  // Data protocol
      /vbscript:/i,  // VBScript protocol
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        result.errors.push('Email contains suspicious content');
        return result;
      }
    }

    // Check for blocked domains (basic example)
    const blockedDomains = [
      'tempmail.org',
      '10minutemail.com',
      'guerrillamail.com'
    ];

    const domain = sanitized.split('@')[1];
    if (blockedDomains.includes(domain)) {
      result.errors.push('Email domain is not allowed');
      return result;
    }

    result.isValid = true;
    return result;
  }

  /**
   * Sanitize log data to prevent log injection
   * @param {any} data - Data to be logged
   * @returns {string} - Safe log string
   */
  static sanitizeLogData(data) {
    if (typeof data === 'object') {
      try {
        // Convert to JSON and sanitize
        const jsonString = JSON.stringify(data);
        return this.sanitizeInput(jsonString)
          .replace(/\n/g, ' ') // Remove newlines
          .replace(/\r/g, ' ') // Remove carriage returns
          .substring(0, 1000); // Limit length
      } catch (error) {
        return '[Invalid JSON data]';
      }
    }

    return this.sanitizeInput(String(data))
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .substring(0, 1000);
  }

  /**
   * Validate and sanitize platform parameter
   * @param {string} platform - Platform string
   * @returns {string} - Validated platform or default
   */
  static validatePlatform(platform) {
    const allowedPlatforms = ['windows', 'macos', 'linux'];
    const sanitized = this.sanitizeInput(platform).toLowerCase();
    
    return allowedPlatforms.includes(sanitized) ? sanitized : 'windows';
  }

  /**
   * Validate and sanitize version parameter
   * @param {string} version - Version string
   * @returns {string} - Validated version or default
   */
  static validateVersion(version) {
    const sanitized = this.sanitizeInput(version);
    
    // Basic semver pattern validation
    const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
    
    if (semverPattern.test(sanitized)) {
      return sanitized;
    }
    
    return '0.9.4'; // Default version
  }
}

module.exports = SecurityUtils;