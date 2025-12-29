import { createResponse } from '@/lib/middleware.js';
import cache from '@/lib/cache.js';
import rateLimiter from '@/lib/rateLimiter.js';

export async function GET() {
  const startTime = Date.now();
  
  // Health check
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    },
    cache: {
      size: cache.size(),
      stats: cache.stats()
    },
    rateLimiter: rateLimiter.getStats(),
    responseTime: `${Date.now() - startTime}ms`
  };

  return createResponse(health, 200, {
    'Cache-Control': 'no-cache'
  });
}

