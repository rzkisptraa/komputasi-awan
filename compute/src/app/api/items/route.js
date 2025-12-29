import { getItems } from '@/lib/dataService.js';
import { rateLimitMiddleware, createResponse, createErrorResponse } from '@/lib/middleware.js';

export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return createErrorResponse('Invalid pagination parameters', 400);
    }

    // Get data
    const startTime = Date.now();
    const data = await getItems(page, limit);
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
    console.error('Error in GET /api/items:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

