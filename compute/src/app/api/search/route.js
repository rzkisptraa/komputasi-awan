import { searchItems } from '@/lib/dataService.js';
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

    // Get query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return createErrorResponse('Search query is required', 400);
    }

    if (query.length > 100) {
      return createErrorResponse('Search query too long', 400);
    }

    // Sanitize query (basic)
    const sanitizedQuery = query.trim().substring(0, 100);

    // Get data
    const startTime = Date.now();
    const data = await searchItems(sanitizedQuery);
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
    console.error('Error in GET /api/search:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

