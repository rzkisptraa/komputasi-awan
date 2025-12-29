'use client';

import { useState, useEffect } from 'react';

export default function HealthMonitor() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/metrics')
      ]);
      
      const healthData = await healthRes.json();
      const metricsData = await metricsRes.json();
      
      setHealth(healthData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to fetch health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading health data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">System Health</h2>
        <button
          onClick={fetchHealth}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Health Status</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span className={health.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                  {health.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Uptime:</span> {Math.round(health.uptime)}s
              </div>
              <div>
                <span className="font-semibold">Response Time:</span> {health.responseTime}
              </div>
            </div>
          </div>

          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Memory Usage</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Used:</span> {health.memory.used} {health.memory.unit}
              </div>
              <div>
                <span className="font-semibold">Total:</span> {health.memory.total} {health.memory.unit}
              </div>
              <div className="mt-2">
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(health.memory.used / health.memory.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Cache</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Size:</span> {health.cache.size} items
              </div>
            </div>
          </div>

          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Rate Limiter</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Active IPs:</span> {health.rateLimiter.activeIPs}
              </div>
              <div>
                <span className="font-semibold">Total Requests:</span> {health.rateLimiter.totalRequests}
              </div>
            </div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <h3 className="font-semibold mb-2">Detailed Metrics</h3>
          <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

