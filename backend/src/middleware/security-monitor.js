const SecurityUtils = require('../utils/security');

/**
 * Security monitoring middleware to track suspicious activities
 */
class SecurityMonitor {
  constructor() {
    this.suspiciousIPs = new Map(); // IP -> { count, lastSeen, violations }
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000); // Cleanup every hour
  }

  /**
   * Middleware to monitor and log suspicious activities
   */
  monitor() {
    return (req, res, next) => {
      const ip = req.ip;
      const userAgent = req.get('User-Agent') || '';
      const path = req.path;
      const method = req.method;

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /[<>"']/,  // HTML/script injection attempts
        /javascript:/i,  // JavaScript protocol
        /data:/i,  // Data protocol
        /vbscript:/i,  // VBScript protocol
        /\.\.\//,  // Path traversal attempts
        /union.*select/i,  // SQL injection attempts
        /script.*alert/i,  // XSS attempts
      ];

      let violations = [];

      // Check URL for suspicious patterns
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(req.url)) {
          violations.push(`Suspicious URL pattern: ${pattern.toString()}`);
        }
      }

      // Check User-Agent for suspicious patterns
      const suspiciousUserAgents = [
        /sqlmap/i,
        /nikto/i,
        /nmap/i,
        /burp/i,
        /scanner/i,
        /bot.*hack/i,
      ];

      for (const pattern of suspiciousUserAgents) {
        if (pattern.test(userAgent)) {
          violations.push(`Suspicious User-Agent: ${pattern.toString()}`);
        }
      }

      // Check for rapid requests from same IP
      const ipData = this.suspiciousIPs.get(ip) || { count: 0, lastSeen: Date.now(), violations: [] };
      const now = Date.now();
      const timeDiff = now - ipData.lastSeen;

      // Reset count if more than 1 minute has passed
      if (timeDiff > 60 * 1000) {
        ipData.count = 0;
      }

      ipData.count++;
      ipData.lastSeen = now;

      // Flag rapid requests (more than 30 requests per minute)
      if (ipData.count > 30 && timeDiff < 60 * 1000) {
        violations.push('Rapid request pattern detected');
      }

      // Log violations
      if (violations.length > 0) {
        ipData.violations.push(...violations);
        this.suspiciousIPs.set(ip, ipData);

        const logData = {
          ip,
          method,
          path,
          userAgent: SecurityUtils.sanitizeInput(userAgent).substring(0, 200),
          violations,
          timestamp: new Date().toISOString()
        };

        console.warn('🚨 Suspicious activity detected:', SecurityUtils.sanitizeLogData(logData));
      } else {
        this.suspiciousIPs.set(ip, ipData);
      }

      next();
    };
  }

  /**
   * Get security statistics
   */
  getStats() {
    const stats = {
      totalSuspiciousIPs: this.suspiciousIPs.size,
      recentViolations: 0,
      topViolations: new Map()
    };

    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (data.lastSeen > oneHourAgo) {
        stats.recentViolations += data.violations.length;
        
        // Count violation types
        for (const violation of data.violations) {
          const count = stats.topViolations.get(violation) || 0;
          stats.topViolations.set(violation, count + 1);
        }
      }
    }

    return stats;
  }

  /**
   * Clean up old entries
   */
  cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (data.lastSeen < oneHourAgo) {
        this.suspiciousIPs.delete(ip);
      }
    }

    console.log(`Security monitor cleanup: ${this.suspiciousIPs.size} IPs being monitored`);
  }

  /**
   * Check if IP is flagged as suspicious
   */
  isSuspicious(ip) {
    const data = this.suspiciousIPs.get(ip);
    return data && data.violations.length > 5; // Flag after 5 violations
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

module.exports = SecurityMonitor;