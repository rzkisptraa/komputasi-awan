/**
 * Load Testing Script
 * 
 * Usage:
 *   node load-test.js [options]
 * 
 * Options:
 *   --url <url>          Base URL (default: http://localhost:3000)
 *   --concurrent <n>     Number of concurrent requests (default: 10)
 *   --requests <n>       Total number of requests (default: 100)
 *   --endpoint <path>    API endpoint to test (default: /api/items?page=1&limit=10)
 */

const http = require('http');
const https = require('https');

const args = process.argv.slice(2);
const options = {
  url: 'http://localhost:3000',
  concurrent: 10,
  requests: 100,
  endpoint: '/api/items?page=1&limit=10'
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    options.url = args[i + 1];
    i++;
  } else if (args[i] === '--concurrent' && args[i + 1]) {
    options.concurrent = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--requests' && args[i + 1]) {
    options.requests = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--endpoint' && args[i + 1]) {
    options.endpoint = args[i + 1];
    i++;
  }
}

const url = new URL(options.endpoint, options.url);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

const results = {
  total: 0,
  success: 0,
  errors: 0,
  responseTimes: [],
  statusCodes: {}
};

function makeRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = client.get(url.href, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        results.responseTimes.push(responseTime);
        results.statusCodes[res.statusCode] = (results.statusCodes[res.statusCode] || 0) + 1;
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          results.success++;
        } else {
          results.errors++;
        }
        results.total++;
        
        resolve({ statusCode: res.statusCode, responseTime, success: res.statusCode < 300 });
      });
    });
    
    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      results.responseTimes.push(responseTime);
      results.errors++;
      results.total++;
      resolve({ error: err.message, responseTime, success: false });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      results.errors++;
      results.total++;
      resolve({ error: 'Timeout', success: false });
    });
  });
}

async function runLoadTest() {
  console.log('Starting load test...');
  console.log(`URL: ${url.href}`);
  console.log(`Concurrent: ${options.concurrent}`);
  console.log(`Total Requests: ${options.requests}`);
  console.log('---\n');
  
  const startTime = Date.now();
  const promises = [];
  let completed = 0;
  
  // Create request batches
  for (let i = 0; i < options.requests; i++) {
    promises.push(makeRequest());
    
    // Execute in batches
    if (promises.length >= options.concurrent) {
      await Promise.all(promises.splice(0, options.concurrent));
      completed += options.concurrent;
      process.stdout.write(`\rProgress: ${completed}/${options.requests} requests completed`);
    }
  }
  
  // Wait for remaining requests
  if (promises.length > 0) {
    await Promise.all(promises);
    completed += promises.length;
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Calculate statistics
  const responseTimes = results.responseTimes.sort((a, b) => a - b);
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = responseTimes[0] || 0;
  const maxResponseTime = responseTimes[responseTimes.length - 1] || 0;
  const medianResponseTime = responseTimes[Math.floor(responseTimes.length / 2)] || 0;
  const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
  const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;
  const requestsPerSecond = (results.total / totalTime) * 1000;
  const successRate = (results.success / results.total) * 100;
  
  // Print results
  console.log('\n\n=== Load Test Results ===');
  console.log(`Total Time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
  console.log(`Total Requests: ${results.total}`);
  console.log(`Successful: ${results.success} (${successRate.toFixed(2)}%)`);
  console.log(`Errors: ${results.errors} (${(100 - successRate).toFixed(2)}%)`);
  console.log(`\nRequests Per Second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`\nResponse Times:`);
  console.log(`  Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  Min: ${minResponseTime}ms`);
  console.log(`  Max: ${maxResponseTime}ms`);
  console.log(`  Median: ${medianResponseTime}ms`);
  console.log(`  95th percentile: ${p95ResponseTime}ms`);
  console.log(`  99th percentile: ${p99ResponseTime}ms`);
  console.log(`\nStatus Codes:`);
  Object.entries(results.statusCodes).forEach(([code, count]) => {
    console.log(`  ${code}: ${count}`);
  });
  console.log('\n=== Test Complete ===');
}

runLoadTest().catch(console.error);

