# Learning Management System - Backend API

> High-performance Go backend built with Fiber v2.52+ and Turso (libSQL) database

[![Go](https://img.shields.io/badge/Go-1.25+-00ADD8?style=flat-square&logo=go)](https://golang.org/)
[![Fiber](https://img.shields.io/badge/Fiber-v2.52-00ACD7?style=flat-square)](https://gofiber.io/)
[![Turso](https://img.shields.io/badge/Turso-libSQL-4FF8D2?style=flat-square)](https://turso.tech/)

RESTful API backend for the Learning Management System providing endpoints for DSA topics, System Design, Certifications, User Authentication, and Gamification features.

## 🚀 Quick Start

### Prerequisites

- **Go 1.25+** installed
- **Turso account** and database ([Get started](https://turso.tech/))
- **Git** for version control

### 1. Setup Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Create a new database
turso db create learning-management

# Get database URL
turso db show learning-management --url

# Get auth token
turso db tokens create learning-management
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Turso credentials
# TURSO_DATABASE_URL=libsql://your-database.turso.io
# TURSO_AUTH_TOKEN=your-auth-token
# JWT_SECRET=your-secret-key
```

### 3. Install Dependencies

```bash
go mod download
```

### 4. Run the Server

```bash
# Development mode
go run cmd/server/main.go

# Or build and run
go build -o bin/server cmd/server/main.go
./bin/server
```

The server will start on `http://localhost:8080`

## 📚 API Documentation

### Health Check

```bash
GET /api/health
```

### Authentication

```bash
# Register
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

# Get current user (protected)
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### DSA Topics

```bash
# Get all DSA topics
GET /api/dsa/topics

# Get specific topic
GET /api/dsa/topics/:id

# Get categories
GET /api/dsa/categories
```

### System Design

```bash
# Get all system design topics
GET /api/system-design/topics

# Get specific topic
GET /api/system-design/topics/:id

# Get AI system design topics
GET /api/ai-system-design/topics
```

### Certifications

```bash
# Get all certifications
GET /api/certifications

# Get specific certification
GET /api/certifications/:id

# Get providers
GET /api/certifications/providers
```

### Gamification (Protected)

```bash
# Get user stats
GET /api/gamification/stats
Authorization: Bearer <jwt-token>

# Add XP
POST /api/gamification/xp
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 50
}

# Unlock achievement
POST /api/gamification/achievements
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "achievementId": "first-topic",
  "title": "First Steps",
  "description": "Completed your first topic",
  "icon": "trophy",
  "rarity": "common"
}

# Update streak
POST /api/gamification/streak
Authorization: Bearer <jwt-token>

# Update progress
POST /api/progress
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "topicId": "array",
  "topicType": "dsa",
  "progress": 75
}
```

## 🏗️ Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Configuration management
│   ├── database/
│   │   ├── turso.go             # Turso database connection
│   │   └── migrations.go        # Database schema migrations
│   ├── models/
│   │   ├── user.go              # User model
│   │   ├── dsa.go               # DSA topic model
│   │   ├── system_design.go     # System Design model
│   │   ├── certification.go     # Certification model
│   │   └── gamification.go      # Gamification models
│   ├── repository/
│   │   ├── user_repository.go
│   │   ├── dsa_repository.go
│   │   ├── system_design_repository.go
│   │   ├── certification_repository.go
│   │   └── gamification_repository.go
│   ├── handlers/
│   │   ├── health_handler.go
│   │   ├── auth_handler.go
│   │   ├── dsa_handler.go
│   │   ├── system_design_handler.go
│   │   ├── certification_handler.go
│   │   └── gamification_handler.go
│   ├── middleware/
│   │   ├── auth.go              # JWT authentication
│   │   ├── cors.go              # CORS configuration
│   │   ├── logger.go            # Request logging
│   │   ├── rate_limiter.go      # Rate limiting
│   │   └── error_handler.go     # Error handling
│   ├── routes/
│   │   └── routes.go            # Route registration
│   └── utils/
│       ├── response.go          # API response helpers
│       └── validator.go         # Input validation
├── scripts/
│   └── seed.go                  # Database seeding (TODO)
├── .env.example                 # Environment template
├── .gitignore
├── go.mod
├── go.sum
├── Dockerfile
└── README.md
```

## 🔧 Technology Stack

- **[Go 1.25+](https://golang.org/)** - Programming language
- **[Fiber v2.52+](https://gofiber.io/)** - Web framework
- **[Turso (libSQL)](https://turso.tech/)** - Edge database
- **[JWT](https://github.com/golang-jwt/jwt)** - Authentication
- **[bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt)** - Password hashing

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt
- **Rate Limiting** - 100 requests/minute per IP
- **CORS Protection** - Configured origins
- **Input Validation** - Email, password strength
- **SQL Injection Prevention** - Parameterized queries

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t learning-management-backend .

# Run container
docker run -p 8080:8080 \
  -e TURSO_DATABASE_URL=your-url \
  -e TURSO_AUTH_TOKEN=your-token \
  -e JWT_SECRET=your-secret \
  learning-management-backend
```

### Production Build

```bash
# Build optimized binary
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/server cmd/server/main.go

# Run
./bin/server
```

## 📝 Environment Variables

| Variable             | Description                          | Required | Default                 |
| -------------------- | ------------------------------------ | -------- | ----------------------- |
| `PORT`               | Server port                          | No       | `8080`                  |
| `ENV`                | Environment (development/production) | No       | `development`           |
| `TURSO_DATABASE_URL` | Turso database URL                   | Yes      | -                       |
| `TURSO_AUTH_TOKEN`   | Turso auth token                     | Yes      | -                       |
| `JWT_SECRET`         | JWT signing secret                   | Yes      | -                       |
| `JWT_EXPIRY`         | JWT expiration duration              | No       | `24h`                   |
| `FRONTEND_URL`       | Frontend origin for CORS             | No       | `http://localhost:5173` |
| `RATE_LIMIT_MAX`     | Max requests per window              | No       | `100`                   |
| `RATE_LIMIT_WINDOW`  | Rate limit time window               | No       | `1m`                    |

## 🧪 Testing

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific package tests
go test ./internal/handlers -v
```

## 📊 Database Schema

The backend uses Turso (libSQL) with the following tables:

- `users` - User accounts
- `dsa_topics` - DSA learning content
- `system_design_topics` - System design content
- `certifications` - Certification paths
- `user_progress` - Learning progress tracking
- `gamification_stats` - XP, levels, streaks
- `achievements` - Unlocked achievements

Migrations run automatically on server start.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Fiber](https://gofiber.io/) - Fast HTTP framework
- [Turso](https://turso.tech/) - Edge database platform
- [Go](https://golang.org/) - Programming language

---

**Built with ❤️ using Go, Fiber, and Turso**
