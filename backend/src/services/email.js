const SecurityUtils = require('../utils/security');

class EmailService {
  /**
   * Validate email address with comprehensive security checks
   * @param {string} email - Email to validate
   * @returns {object} - Validation result with details
   */
  validateEmail(email) {
    return SecurityUtils.validateEmail(email);
  }

  /**
   * Legacy method for backward compatibility
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  isValidEmail(email) {
    const result = this.validateEmail(email);
    return result.isValid;
  }

  /**
   * Normalize email address
   * @param {string} email 
   * @returns {string}
   */
  normalizeEmail(email) {
    if (!email || typeof email !== 'string') {
      return '';
    }

    return email.trim().toLowerCase();
  }

  /**
   * Extract domain from email
   * @param {string} email 
   * @returns {string}
   */
  getDomain(email) {
    if (!this.isValidEmail(email)) {
      return '';
    }

    return email.split('@')[1].toLowerCase();
  }

  /**
   * Check if email is from a known provider
   * @param {string} email 
   * @returns {object}
   */
  getEmailProvider(email) {
    const domain = this.getDomain(email);
    
    const providers = {
      'gmail.com': 'Gmail',
      'yahoo.com': 'Yahoo',
      'outlook.com': 'Outlook',
      'hotmail.com': 'Hotmail',
      'icloud.com': 'iCloud',
      'protonmail.com': 'ProtonMail',
      'aol.com': 'AOL'
    };

    return {
      domain,
      provider: providers[domain] || 'Other',
      isCommon: !!providers[domain]
    };
  }

  /**
   * Generate suggestions for typos in email
   * @param {string} email 
   * @returns {array}
   */
  getSuggestions(email) {
    if (!email || !email.includes('@')) {
      return [];
    }

    const [localPart, domainPart] = email.split('@');
    const suggestions = [];

    // Common domain typo corrections
    const domainCorrections = {
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yahoo.co': 'yahoo.com',
      'outlook.co': 'outlook.com',
      'hotmial.com': 'hotmail.com'
    };

    if (domainCorrections[domainPart]) {
      suggestions.push(`${localPart}@${domainCorrections[domainPart]}`);
    }

    return suggestions;
  }
}

module.exports = EmailService;