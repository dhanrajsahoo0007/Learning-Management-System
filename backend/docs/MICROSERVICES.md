# Microservices Architecture

This document describes the microservices architecture for the Learning Management System.

## Architecture Overview

The system is divided into 7 microservices:

1. **API Gateway** (Port 8080) - Entry point for all client requests
2. **Auth Service** (Port 8081) - User authentication and authorization
3. **DSA Service** (Port 8082) - Data Structures & Algorithms content
4. **System Design Service** (Port 8083) - Traditional system design topics
5. **AI System Design Service** (Port 8084) - AI-specific system design topics
6. **Certifications Service** (Port 8085) - Certification tracking and roadmaps
7. **Gamification Service** (Port 8086) - User XP, levels, achievements, streaks

## Quick Start

### Using Docker Compose (Recommended)

1. **Copy environment variables**:

   ```bash
   cp .env.services .env
   # Edit .env and fill in your Turso database credentials
   ```

2. **Build and start all services**:

   ```bash
   docker-compose up --build
   ```

3. **Access the API Gateway**:
   ```
   http://localhost:8080
   ```

### Local Development (Without Docker)

1. **Set up environment variables**:

   ```bash
   cp .env.services .env
   # Edit .env with your configuration
   ```

2. **Start each service in separate terminals**:

   ```bash
   # Terminal 1 - Auth Service
   cd services/auth && go run main.go

   # Terminal 2 - DSA Service
   cd services/dsa && go run main.go

   # Terminal 3 - System Design Service
   cd services/system-design && go run main.go

   # Terminal 4 - AI System Design Service
   cd services/ai-system-design && go run main.go

   # Terminal 5 - Certifications Service
   cd services/certifications && go run main.go

   # Terminal 6 - Gamification Service
   cd services/gamification && go run main.go

   # Terminal 7 - API Gateway
   cd services/gateway && go run main.go
   ```

## Service Details

### API Gateway

**Responsibilities**:

- Route requests to appropriate microservices
- Handle CORS
- Rate limiting
- Request logging

**Endpoints**:

- `GET /` - Gateway info
- `GET /api/health` - Health check
- `/api/auth/*` → Auth Service
- `/api/dsa/*` → DSA Service
- `/api/system-design/*` → System Design Service
- `/api/ai-system-design/*` → AI System Design Service
- `/api/certifications/*` → Certifications Service
- `/api/gamification/*` → Gamification Service

### Auth Service

**Endpoints**:

- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user (protected)
- `GET /health` - Health check

### DSA Service

**Endpoints**:

- `GET /topics` - List all DSA topics
- `GET /topics/:id` - Get specific topic
- `GET /categories` - Get topic categories
- `POST /topics/:id/complete` - Mark topic complete (awards XP)
- `GET /health` - Health check

### System Design Service

**Endpoints**:

- `GET /topics` - List system design topics
- `GET /topics/:id` - Get specific topic
- `POST /topics/:id/complete` - Mark topic complete
- `GET /health` - Health check

### AI System Design Service

**Endpoints**:

- `GET /topics` - List AI system design topics
- `GET /topics/:id` - Get specific AI topic
- `POST /topics/:id/complete` - Mark topic complete
- `GET /health` - Health check

### Certifications Service

**Endpoints**:

- `GET /` - List all certifications
- `GET /:id` - Get specific certification
- `GET /providers` - Get certification providers
- `POST /:id/progress` - Update progress
- `GET /health` - Health check

### Gamification Service

**Endpoints**:

- `GET /stats` - Get user gamification stats (protected)
- `POST /xp` - Add XP to user (protected)
- `POST /achievements` - Unlock achievement (protected)
- `POST /streak` - Update user streak (protected)
- `POST /progress` - Update user progress (protected)
- `POST /internal/award-xp` - Internal API for other services
- `GET /health` - Health check

## Inter-Service Communication

Services communicate via HTTP REST APIs:

- **DSA → Gamification**: Awards XP when user completes a topic
- **System Design → Gamification**: Awards XP when user completes a topic
- **AI System Design → Gamification**: Awards XP when user completes a topic
- **Certifications → Gamification**: Awards XP for certification progress

## Database Strategy

All services connect to the same Turso database (shared database pattern). This simplifies:

- Data consistency
- Transactions across domains
- Initial migration from monolith

Future consideration: Split into separate databases per service for better isolation.

## Environment Variables

Each service requires:

- `PORT` - Service port number
- `ENVIRONMENT` - development/production
- `DATABASE_URL` - Turso database URL
- `DATABASE_AUTH_TOKEN` - Turso auth token
- `JWT_SECRET` - JWT signing secret
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins

Services that call other services also need:

- `GAMIFICATION_SERVICE_URL` - URL to gamification service

## Health Checks

Each service exposes a `/health` endpoint that returns:

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

## Troubleshooting

### Services can't connect to database

- Verify `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in `.env`
- Check Turso database is accessible
- Ensure migrations have run

### Inter-service communication fails

- Verify service URLs are correct
- Check services are running on expected ports
- Review Docker network configuration if using Docker Compose

### Frontend can't reach API

- Ensure API Gateway is running on port 8080
- Update frontend API base URL to `http://localhost:8080/api`
- Check CORS configuration

## Deployment

### Docker Compose

```bash
docker-compose up -d
```

### Individual Services

Each service can be deployed independently:

```bash
cd services/auth
docker build -t lms-auth .
docker run -p 8081:8081 --env-file .env lms-auth
```

## Monitoring

Monitor service health:

```bash
# Check all services
curl http://localhost:8080/api/health  # Gateway
curl http://localhost:8081/health      # Auth
curl http://localhost:8082/health      # DSA
curl http://localhost:8083/health      # System Design
curl http://localhost:8084/health      # AI System Design
curl http://localhost:8085/health      # Certifications
curl http://localhost:8086/health      # Gamification
```

## Development Tips

1. **Use Docker Compose for full stack testing**
2. **Run individual services locally for faster iteration**
3. **Check logs**: `docker-compose logs -f [service-name]`
4. **Rebuild after changes**: `docker-compose up --build`
5. **Clean restart**: `docker-compose down && docker-compose up --build`
