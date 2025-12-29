import { createResponse } from '@/lib/middleware.js';
import cache from '@/lib/cache.js';
import rateLimiter from '@/lib/rateLimiter.js';

export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: 'MB'
      },
      cpu: process.cpuUsage()
    },
    cache: {
      size: cache.size(),
      stats: cache.stats()
    },
    rateLimiter: rateLimiter.getStats(),
    nodeVersion: process.version,
    platform: process.platform
  };

  return createResponse(metrics, 200, {
    'Cache-Control': 'no-cache'
  });
}

