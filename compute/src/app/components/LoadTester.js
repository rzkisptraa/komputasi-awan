'use client';

import { useState } from 'react';

export default function LoadTester() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [concurrent, setConcurrent] = useState(10);
  const [requests, setRequests] = useState(100);

  const runLoadTest = async () => {
    setTesting(true);
    setResults(null);

    const startTime = Date.now();
    const promises = [];
    let successCount = 0;
    let errorCount = 0;
    const responseTimes = [];

    // Create concurrent requests
    for (let i = 0; i < requests; i++) {
      const promise = fetch('/api/items?page=1&limit=10')
        .then(async (res) => {
          const data = await res.json();
          const responseTime = Date.now() - startTime;
          responseTimes.push(responseTime);
          if (res.ok && !data.error) {
            successCount++;
          } else {
            errorCount++;
          }
          return { success: res.ok, responseTime, data };
        })
        .catch((err) => {
          errorCount++;
          return { success: false, error: err.message };
        });

      promises.push(promise);

      // Limit concurrent requests
      if (promises.length >= concurrent) {
        await Promise.all(promises.splice(0, concurrent));
      }
    }

    // Wait for remaining requests
    await Promise.all(promises);

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
    const requestsPerSecond = (requests / totalTime) * 1000;

    setResults({
      totalRequests: requests,
      successCount,
      errorCount,
      totalTime: `${totalTime}ms`,
      avgResponseTime: `${Math.round(avgResponseTime)}ms`,
      minResponseTime: `${minResponseTime}ms`,
      maxResponseTime: `${maxResponseTime}ms`,
      requestsPerSecond: requestsPerSecond.toFixed(2),
      successRate: ((successCount / requests) * 100).toFixed(2) + '%'
    });

    setTesting(false);
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold">Load Testing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Concurrent Requests: {concurrent}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={concurrent}
            onChange={(e) => setConcurrent(parseInt(e.target.value))}
            className="w-full"
            disabled={testing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Total Requests: {requests}
          </label>
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={requests}
            onChange={(e) => setRequests(parseInt(e.target.value))}
            className="w-full"
            disabled={testing}
          />
        </div>
      </div>

      <button
        onClick={runLoadTest}
        disabled={testing}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {testing ? 'Running Test...' : 'Run Load Test'}
      </button>

      {results && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold mb-3">Test Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Total Requests</div>
              <div className="text-lg">{results.totalRequests}</div>
            </div>
            <div>
              <div className="font-semibold">Success</div>
              <div className="text-lg text-green-600">{results.successCount}</div>
            </div>
            <div>
              <div className="font-semibold">Errors</div>
              <div className="text-lg text-red-600">{results.errorCount}</div>
            </div>
            <div>
              <div className="font-semibold">Success Rate</div>
              <div className="text-lg">{results.successRate}</div>
            </div>
            <div>
              <div className="font-semibold">Total Time</div>
              <div className="text-lg">{results.totalTime}</div>
            </div>
            <div>
              <div className="font-semibold">Avg Response</div>
              <div className="text-lg">{results.avgResponseTime}</div>
            </div>
            <div>
              <div className="font-semibold">Min Response</div>
              <div className="text-lg">{results.minResponseTime}</div>
            </div>
            <div>
              <div className="font-semibold">Max Response</div>
              <div className="text-lg">{results.maxResponseTime}</div>
            </div>
            <div className="col-span-2 md:col-span-4">
              <div className="font-semibold">Requests Per Second</div>
              <div className="text-2xl font-bold text-blue-600">{results.requestsPerSecond}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

