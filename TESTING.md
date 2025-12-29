# Panduan Testing Aplikasi Scalable

## 1. Testing Manual

### 1.1 Health Check
```bash
curl http://localhost:3000/api/health
```

### 1.2 Metrics
```bash
curl http://localhost:3000/api/metrics
```

### 1.3 Get Items
```bash
curl http://localhost:3000/api/items?page=1&limit=10
```

### 1.4 Search
```bash
curl http://localhost:3000/api/search?q=test
```

## 2. Load Testing dengan Script

### 2.1 Basic Load Test
```bash
node load-test.js
```

### 2.2 Custom Load Test
```bash
# 50 concurrent requests, 500 total requests
node load-test.js --concurrent 50 --requests 500

# Test different endpoint
node load-test.js --endpoint /api/search?q=test --concurrent 20 --requests 200

# Test different URL
node load-test.js --url http://localhost:3001 --concurrent 10 --requests 100
```

## 3. Load Testing dengan Apache Bench (ab)

### 3.1 Install Apache Bench
- **Windows**: Download dari Apache website atau use WSL
- **Linux/Mac**: Usually pre-installed

### 3.2 Basic Test
```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/api/items?page=1&limit=10
```

### 3.3 Advanced Test
```bash
# 5000 requests, 50 concurrent, keep-alive
ab -n 5000 -c 50 -k http://localhost:3000/api/items?page=1&limit=10
```

## 4. Load Testing dengan UI

1. Buka aplikasi di browser: `http://localhost:3000`
2. Klik tab "Load Testing"
3. Atur concurrent requests dan total requests
4. Klik "Run Load Test"
5. Lihat hasil real-time

## 5. Monitoring Performance

### 5.1 Health Monitor UI
1. Buka aplikasi di browser
2. Klik tab "Health Monitor"
3. Monitor real-time metrics:
   - System health
   - Memory usage
   - Cache statistics
   - Rate limiter stats

### 5.2 API Metrics
```bash
# Get detailed metrics
curl http://localhost:3000/api/metrics | jq
```

## 6. Testing Scenarios

### 6.1 Normal Load
- 10-50 concurrent users
- 100-1000 requests
- Expected: < 200ms response time, 99%+ success rate

### 6.2 High Load
- 50-100 concurrent users
- 1000-5000 requests
- Expected: < 500ms response time, 95%+ success rate

### 6.3 Stress Test
- 100+ concurrent users
- 5000+ requests
- Expected: System should handle gracefully, may see some rate limiting

### 6.4 Cache Testing
1. Request same endpoint multiple times
2. First request: fromCache = false
3. Subsequent requests: fromCache = true
4. Response time should be significantly faster for cached requests

### 6.5 Rate Limiting Test
1. Send 100+ requests rapidly from same IP
2. Should receive 429 (Too Many Requests) after limit
3. Check retry-after header

## 7. Expected Results

### 7.1 Performance Targets
- **Cached Response**: < 50ms
- **Uncached Response**: < 200ms
- **Throughput**: 1000+ requests/second (with multiple instances)
- **Success Rate**: > 99%

### 7.2 Scalability Indicators
- Response time remains stable under load
- Memory usage doesn't grow unbounded
- Cache hit rate increases over time
- Rate limiter prevents abuse

## 8. Troubleshooting

### 8.1 High Error Rate
- Check rate limiting settings
- Verify server resources (CPU, memory)
- Check for memory leaks

### 8.2 Slow Response Times
- Check cache hit rate
- Verify database query performance
- Check network latency

### 8.3 Memory Issues
- Monitor memory usage via /api/metrics
- Check for memory leaks
- Consider increasing server resources

## 9. Production Testing

### 9.1 Before Deployment
- Run full load test suite
- Verify all endpoints
- Check health endpoints
- Monitor metrics

### 9.2 After Deployment
- Continuous health monitoring
- Set up alerts for:
  - High error rates
  - Slow response times
  - High memory usage
  - Unhealthy status

