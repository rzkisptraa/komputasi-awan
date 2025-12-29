import { getItemById } from '@/lib/dataService.js';
import { rateLimitMiddleware, createResponse, createErrorResponse } from '@/lib/middleware.js';

export async function GET(request, { params }) {
  try {
    // Rate limiting
    const rateLimit = rateLimitMiddleware(request);
    if (rateLimit.error) {
      return createErrorResponse(
        rateLimit.message,
        rateLimit.status,
        { retryAfter: rateLimit.retryAfter }
      );
    }

    const id = parseInt(params.id, 10);

    // Validate ID
    if (isNaN(id) || id < 1) {
      return createErrorResponse('Invalid item ID', 400);
    }

    // Get data
    const startTime = Date.now();
    const data = await getItemById(id);
    const responseTime = Date.now() - startTime;

    return createResponse({
      ...data,
      responseTime: `${responseTime}ms`,
      rateLimit: {
        remaining: rateLimit.limit.remaining,
        resetTime: new Date(rateLimit.limit.resetTime).toISOString()
      }
    });
  } catch (error) {
    console.error('Error in GET /api/items/[id]:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

