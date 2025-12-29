'use client';

import { useState, useEffect } from 'react';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  const fetchItems = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const startTime = Date.now();
      const res = await fetch(`/api/items?page=${pageNum}&limit=10`);
      const data = await res.json();
      const responseTime = Date.now() - startTime;
      
      if (data.error) {
        setError(data.message);
      } else {
        setItems(data);
        setMetrics({
          responseTime: data.responseTime,
          fromCache: data.fromCache,
          clientResponseTime: `${responseTime}ms`,
          rateLimit: data.rateLimit
        });
      }
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Items List</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading || !items.hasMore}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {metrics && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="font-semibold">Response Time:</span> {metrics.responseTime}
            </div>
            <div>
              <span className="font-semibold">From Cache:</span> {metrics.fromCache ? 'Yes ✓' : 'No'}
            </div>
            <div>
              <span className="font-semibold">Client Time:</span> {metrics.clientResponseTime}
            </div>
            <div>
              <span className="font-semibold">Rate Limit:</span> {metrics.rateLimit?.remaining || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.items?.map((item) => (
            <div key={item.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{item.description}</p>
              <p className="text-xs text-zinc-500 mt-2">{item.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

