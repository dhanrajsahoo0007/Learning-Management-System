# Learning Management System - Backend (Microservices)

A scalable microservices architecture for a comprehensive Learning Management System built with Go, Fiber, and Turso.

## 🏗️ Architecture

This backend consists of **7 independent microservices**:

| Service              | Port | Description                                 |
| -------------------- | ---- | ------------------------------------------- |
| **API Gateway**      | 8080 | Entry point, routes to all services         |
| **Auth Service**     | 8081 | User authentication & JWT tokens            |
| **DSA Service**      | 8082 | Data Structures & Algorithms (895 problems) |
| **System Design**    | 8083 | Traditional system design topics            |
| **AI System Design** | 8084 | AI-specific system design topics            |
| **Certifications**   | 8085 | Certification tracking & roadmaps           |
| **Gamification**     | 8086 | XP, levels, achievements, streaks           |

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Turso database account ([setup guide](./docs/TURSO_SETUP.md))

### 1. Environment Setup

```bash
# Copy environment template
cp .env.services .env

# Edit with your credentials
nano .env
```

Required variables:

```env
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
JWT_SECRET=your-super-secret-jwt-key
```

### 2. Start All Services

```bash
# Build and start all 7 services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Verify Services

```bash
# Check all services are healthy
curl http://localhost:8080/api/health  # Gateway
curl http://localhost:8081/health      # Auth
curl http://localhost:8082/health      # DSA
curl http://localhost:8083/health      # System Design
curl http://localhost:8084/health      # AI System Design
curl http://localhost:8085/health      # Certifications
curl http://localhost:8086/health      # Gamification
```

## 📁 Project Structure

```
backend/
├── services/                    # All microservices
│   ├── shared/                 # Shared libraries (config, database, middleware)
│   ├── gateway/                # API Gateway (reverse proxy)
│   ├── auth/                   # Authentication service
│   ├── dsa/                    # DSA service + 895 problem files
│   ├── system-design/          # System Design service
│   ├── ai-system-design/       # AI System Design service
│   ├── certifications/         # Certifications service
│   └── gamification/           # Gamification service
├── docker-compose.yml          # Orchestration config
├── .env.services              # Environment template
├── scripts/                   # Utility scripts
└── docs/                      # Documentation
    ├── MICROSERVICES.md       # Architecture details
    ├── TESTING_GUIDE.md       # Testing procedures
    └── TURSO_SETUP.md         # Database setup
```

## 🔧 Development

### Run Individual Service

```bash
cd services/auth
export PORT=8081
export DATABASE_URL="your-url"
export DATABASE_AUTH_TOKEN="your-token"
export JWT_SECRET="your-secret"
go run main.go
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth
```

### Restart Service

```bash
docker-compose restart dsa
```

### Stop All Services

```bash
docker-compose down
```

## 🧪 Testing

See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) for comprehensive testing procedures.

**Quick Test:**

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test User"}'

# Get DSA topics
curl http://localhost:8080/api/dsa/topics

# Get certifications
curl http://localhost:8080/api/certifications
```

## 📚 API Documentation

### Auth Service

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### DSA Service

- `GET /api/dsa/topics` - List all DSA topics
- `GET /api/dsa/topics/:id` - Get specific topic
- `GET /api/dsa/categories` - Get all categories

### System Design Service

- `GET /api/system-design/topics` - List topics
- `GET /api/system-design/topics/:id` - Get specific topic

### AI System Design Service

- `GET /api/ai-system-design/topics` - List AI topics
- `GET /api/ai-system-design/topics/:id` - Get specific topic

### Certifications Service

- `GET /api/certifications` - List all certifications
- `GET /api/certifications/:id` - Get specific certification
- `GET /api/certifications/providers` - Get providers

### Gamification Service (Protected)

- `GET /api/gamification/stats` - Get user stats
- `POST /api/gamification/xp` - Add XP
- `POST /api/gamification/achievements` - Unlock achievement
- `POST /api/gamification/streak` - Update streak

## 🗄️ Database

Using **Turso** (LibSQL) - serverless SQLite database.

**Setup:** See [docs/TURSO_SETUP.md](./docs/TURSO_SETUP.md)

**Shared Database Strategy:** All services connect to the same Turso database for simplified initial deployment. Can be split into separate databases per service later if needed.

## 🔐 Security

- JWT-based authentication
- CORS protection
- Rate limiting on API Gateway
- Environment-based secrets
- Protected endpoints require Bearer token

## 📊 Monitoring

Each service exposes a `/health` endpoint:

```json
{
  "service": "service-name",
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

## 🚢 Deployment

### Docker Compose (Recommended for Development)

```bash
docker-compose up --build
```

### Individual Services (Production)

Each service can be deployed independently:

1. Build Docker image for each service
2. Deploy to your platform (Vercel, DigitalOcean, AWS, etc.)
3. Configure environment variables
4. Set up service discovery/load balancing

## 🛠️ Tech Stack

- **Language:** Go 1.23
- **Framework:** Fiber v2
- **Database:** Turso (LibSQL/SQLite)
- **Containerization:** Docker
- **Orchestration:** Docker Compose

## 📖 Documentation

- **[MICROSERVICES.md](./docs/MICROSERVICES.md)** - Detailed architecture guide
- **[TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** - Complete testing procedures
- **[TURSO_SETUP.md](./docs/TURSO_SETUP.md)** - Database setup instructions

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes in appropriate service
3. Test locally with Docker Compose
4. Submit pull request

## 📝 License

Part of the Learning Management System project.

---

**Ready to start?** Run `docker-compose up --build` and all services will be available! 🚀
