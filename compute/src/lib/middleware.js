// Middleware utilities for API routes

import rateLimiter from './rateLimiter.js';

export function getClientIP(request) {
  // Try various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback (in development)
  return '127.0.0.1';
}

export function rateLimitMiddleware(request) {
  const ip = getClientIP(request);
  const limit = rateLimiter.checkLimit(ip, 100, 60000); // 100 requests per minute
  
  if (!limit.allowed) {
    return {
      error: true,
      status: 429,
      message: 'Too many requests',
      retryAfter: limit.retryAfter
    };
  }
  
  return {
    error: false,
    limit
  };
}

export function validateRequest(request, requiredFields = []) {
  const errors = [];
  
  // Add validation logic here
  // For now, just a placeholder
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function createResponse(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
      ...headers
    }
  });
}

export function createErrorResponse(message, status = 400, details = null) {
  return Response.json({
    error: true,
    message,
    details,
    timestamp: new Date().toISOString()
  }, {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

