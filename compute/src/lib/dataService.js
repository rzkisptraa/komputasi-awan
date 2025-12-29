// Simulated data service with caching
// In production, this would connect to a real database

import cache from './cache.js';

// Simulate database delay
const simulateDatabaseQuery = async (ms = 50) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulated data
const generateData = (id) => ({
  id,
  title: `Item ${id}`,
  description: `This is a description for item ${id}`,
  timestamp: new Date().toISOString(),
  data: Array.from({ length: 10 }, (_, i) => `Data point ${i + 1}`)
});

export async function getItemById(id) {
  const cacheKey = `item:${id}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // Simulate database query
  await simulateDatabaseQuery(50);
  
  const data = generateData(id);
  
  // Store in cache (5 minutes TTL)
  cache.set(cacheKey, data, 300000);
  
  return { ...data, fromCache: false };
}

export async function getItems(page = 1, limit = 10) {
  const cacheKey = `items:page:${page}:limit:${limit}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // Simulate database query
  await simulateDatabaseQuery(100);
  
  const start = (page - 1) * limit;
  const items = Array.from({ length: limit }, (_, i) => 
    generateData(start + i + 1)
  );
  
  const data = {
    items,
    page,
    limit,
    total: 1000, // Simulated total
    hasMore: page * limit < 1000
  };
  
  // Store in cache (2 minutes TTL for paginated data)
  cache.set(cacheKey, data, 120000);
  
  return { ...data, fromCache: false };
}

export async function searchItems(query) {
  const cacheKey = `search:${query}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  // Simulate search query
  await simulateDatabaseQuery(150);
  
  const results = Array.from({ length: 5 }, (_, i) => 
    generateData(i + 1)
  );
  
  const data = {
    query,
    results,
    count: results.length
  };
  
  // Store in cache (1 minute TTL for search results)
  cache.set(cacheKey, data, 60000);
  
  return { ...data, fromCache: false };
}

