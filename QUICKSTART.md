# Quick Start Guide

## 🚀 Memulai Aplikasi

### 1. Install Dependencies
```bash
cd compute
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Buka Browser
Buka [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Cepat

### Test 1: Cek Health
```bash
curl http://localhost:3000/api/health
```

### Test 2: Get Items
```bash
curl http://localhost:3000/api/items?page=1&limit=10
```

### Test 3: Load Test (UI)
1. Buka http://localhost:3000
2. Klik tab "Load Testing"
3. Klik "Run Load Test"

### Test 4: Load Test (Script)
```bash
node load-test.js --concurrent 10 --requests 100
```

## 📊 Monitor Performance

1. Buka http://localhost:3000
2. Klik tab "Health Monitor"
3. Lihat real-time metrics

## 🐳 Docker Quick Start

```bash
cd compute
docker-compose up -d
```

Aplikasi akan berjalan di http://localhost:3000

## ✅ Checklist Testing

- [ ] Health endpoint berfungsi
- [ ] Items endpoint berfungsi
- [ ] Search endpoint berfungsi
- [ ] Cache bekerja (request kedua lebih cepat)
- [ ] Rate limiting bekerja (100+ requests cepat akan di-block)
- [ ] Load test berhasil
- [ ] Health monitor menampilkan data
- [ ] Metrics endpoint berfungsi

## 🎯 Expected Results

- **First Request**: fromCache = false, response time ~50-200ms
- **Second Request**: fromCache = true, response time < 50ms
- **Load Test**: Success rate > 95%, avg response time < 500ms
- **Health Check**: status = "healthy"

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Module not found
```bash
cd compute
rm -rf node_modules
npm install
```

### Docker issues
```bash
docker-compose down
docker-compose up --build
```

---

**Selamat! Aplikasi siap digunakan! 🎉**

