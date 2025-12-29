// Simple rate limiter implementation
// In production, use Redis-based rate limiting for distributed systems

class RateLimiter {
  constructor() {
    // Store: { ip: { count: number, resetTime: timestamp } }
    this.store = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(ip);
      }
    }
  }

  checkLimit(ip, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const record = this.store.get(ip);

    if (!record || now > record.resetTime) {
      // New window or expired
      this.store.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    if (record.count >= maxRequests) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      };
    }

    record.count++;
    return { 
      allowed: true, 
      remaining: maxRequests - record.count, 
      resetTime: record.resetTime 
    };
  }

  getStats() {
    return {
      activeIPs: this.store.size,
      totalRequests: Array.from(this.store.values()).reduce((sum, r) => sum + r.count, 0)
    };
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;

