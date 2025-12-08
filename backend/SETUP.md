# Backend Setup Guide

## Quick Start

### 1. Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. Setup Turso Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create learning-management

# Get your database URL
turso db show learning-management --url

# Create an auth token
turso db tokens create learning-management
```

### 3. Create .env File

Create a `.env` file in the `backend/` directory with your Turso credentials:

```bash
PORT=8080
ENV=development

# Replace with your actual Turso credentials from step 2
TURSO_DATABASE_URL=libsql://learning-management-YOUR-USERNAME.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...YOUR_ACTUAL_TOKEN

# Generate a secure secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h

FRONTEND_URL=http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1m
```

### 4. Run the Server

```bash
cd backend
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

## Testing

Test the health endpoint:

```bash
curl http://localhost:8080/api/health
```

You should see:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": true,
    "service": "learning-management-backend",
    "version": "1.0.0"
  }
}
```

## Next Steps

1. **Seed the database** with initial data (DSA topics, certifications, etc.)
2. **Test authentication** by registering a user
3. **Integrate with frontend** by updating API endpoints

See [README.md](file:///Users/dhanraj/Workspace/Learning-Management/backend/README.md) for full API documentation.
