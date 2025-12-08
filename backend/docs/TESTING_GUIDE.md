# Microservices Testing Guide

## Pre-Testing Checklist

✅ All 7 microservices implemented:

- Gateway (8080)
- Auth (8081)
- DSA (8082)
- System Design (8083)
- AI System Design (8084)
- Certifications (8085)
- Gamification (8086)

✅ All services have:

- main.go
- go.mod
- Dockerfile
- handlers/
- repository/
- models/

## Testing Strategy

### Phase 1: Environment Setup

1. **Copy environment file**:

   ```bash
   cd /Users/dhanraj/Workspace/Learning-Management/backend
   cp .env.services .env
   ```

2. **Edit .env with your credentials**:
   ```bash
   # Required variables:
   DATABASE_URL=libsql://your-database.turso.io
   DATABASE_AUTH_TOKEN=your-auth-token
   JWT_SECRET=your-secret-key
   ```

### Phase 2: Build and Start Services

**Option A: Docker Compose (Recommended)**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Option B: Individual Services (Development)**

```bash
# Terminal 1 - Auth Service
cd services/auth
export PORT=8081
export DATABASE_URL="your-url"
export DATABASE_AUTH_TOKEN="your-token"
export JWT_SECRET="your-secret"
go run main.go

# Terminal 2 - DSA Service
cd services/dsa
export PORT=8082
# ... (same env vars)
go run main.go

# Repeat for all services...

# Terminal 7 - API Gateway
cd services/gateway
export PORT=8080
export AUTH_SERVICE_URL=http://localhost:8081
export DSA_SERVICE_URL=http://localhost:8082
# ... (all service URLs)
go run main.go
```

### Phase 3: Health Check Verification

Test all service health endpoints:

```bash
# API Gateway
curl http://localhost:8080/api/health

# Auth Service
curl http://localhost:8081/health

# DSA Service
curl http://localhost:8082/health

# System Design Service
curl http://localhost:8083/health

# AI System Design Service
curl http://localhost:8084/health

# Certifications Service
curl http://localhost:8085/health

# Gamification Service
curl http://localhost:8086/health
```

**Expected Response** (for each):

```json
{
  "success": true,
  "data": {
    "service": "service-name",
    "status": "healthy",
    "database": "connected",
    "version": "1.0.0"
  }
}
```

### Phase 4: API Gateway Routing Tests

Test that Gateway correctly routes to all services:

```bash
# Test Auth routing
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Test DSA routing
curl http://localhost:8080/api/dsa/topics

# Test System Design routing
curl http://localhost:8080/api/system-design/topics

# Test AI System Design routing
curl http://localhost:8080/api/ai-system-design/topics

# Test Certifications routing
curl http://localhost:8080/api/certifications

# Test Gamification routing (requires auth token)
curl http://localhost:8080/api/gamification/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Phase 5: Authentication Flow Test

1. **Register a user**:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

2. **Login**:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123"
  }'
```

3. **Save the JWT token from response**

4. **Test protected endpoint**:

```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Phase 6: Service-Specific Tests

#### DSA Service

```bash
# Get all topics
curl http://localhost:8080/api/dsa/topics

# Get categories
curl http://localhost:8080/api/dsa/categories

# Get specific topic
curl http://localhost:8080/api/dsa/topics/arrays
```

#### System Design Service

```bash
# Get all system design topics
curl http://localhost:8080/api/system-design/topics

# Get specific topic
curl http://localhost:8080/api/system-design/topics/load-balancer
```

#### AI System Design Service

```bash
# Get all AI topics
curl http://localhost:8080/api/ai-system-design/topics
```

#### Certifications Service

```bash
# Get all certifications
curl http://localhost:8080/api/certifications

# Get providers
curl http://localhost:8080/api/certifications/providers

# Get specific certification
curl http://localhost:8080/api/certifications/aws-solutions-architect
```

#### Gamification Service (Protected)

```bash
# Get user stats
curl http://localhost:8080/api/gamification/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add XP
curl -X POST http://localhost:8080/api/gamification/xp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

### Phase 7: Frontend Integration Test

1. **Update frontend API configuration**:

```typescript
// frontend/src/api/config.ts
export const API_BASE_URL = "http://localhost:8080/api";
```

2. **Start frontend**:

```bash
cd /Users/dhanraj/Workspace/Learning-Management/frontend
npm run dev
```

3. **Test in browser**:

- Navigate to http://localhost:5173
- Test user registration
- Test login
- Navigate to DSA page
- Navigate to System Design page
- Navigate to Certifications page
- Check gamification stats

### Phase 8: Load Testing (Optional)

```bash
# Install Apache Bench (if not installed)
brew install httpd

# Test Gateway
ab -n 1000 -c 10 http://localhost:8080/api/health

# Test DSA Service
ab -n 1000 -c 10 http://localhost:8080/api/dsa/topics
```

## Troubleshooting

### Services Won't Start

**Issue**: Database connection failed

```
Solution: Check DATABASE_URL and DATABASE_AUTH_TOKEN in .env
```

**Issue**: Port already in use

```
Solution: Kill process using the port or change port in docker-compose.yml
lsof -ti:8080 | xargs kill -9
```

**Issue**: Docker build fails

```
Solution: Clean Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

### Gateway Can't Reach Services

**Issue**: Connection refused

```
Solution: Ensure all services are running
docker-compose ps
```

**Issue**: Wrong service URLs

```
Solution: Check environment variables in docker-compose.yml
Services should use service names (e.g., http://auth:8081)
```

### Authentication Issues

**Issue**: Invalid token

```
Solution: Ensure JWT_SECRET is the same across all services
```

**Issue**: Token expired

```
Solution: Login again to get a new token
```

## Success Criteria

✅ All 7 services start without errors  
✅ All health checks return 200 OK  
✅ API Gateway routes to all services  
✅ User can register and login  
✅ Protected endpoints require authentication  
✅ Frontend can connect and display data  
✅ No CORS errors in browser console

## Next Steps After Testing

1. **Deploy to production**:

   - Set up environment variables on hosting platform
   - Deploy each service independently
   - Configure production database

2. **Monitor services**:

   - Set up logging aggregation
   - Configure health check monitoring
   - Set up alerts for service failures

3. **Scale services**:
   - Identify bottlenecks
   - Scale individual services based on load
   - Add caching layer if needed

## Quick Reference

| Service          | Port | Health Check | Protected |
| ---------------- | ---- | ------------ | --------- |
| Gateway          | 8080 | /api/health  | No        |
| Auth             | 8081 | /health      | No        |
| DSA              | 8082 | /health      | No        |
| System Design    | 8083 | /health      | No        |
| AI System Design | 8084 | /health      | No        |
| Certifications   | 8085 | /health      | No        |
| Gamification     | 8086 | /health      | Yes       |
