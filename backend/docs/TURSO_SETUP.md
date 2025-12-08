# Turso Database Setup Instructions

## Current Status

✅ Backend code is complete and tested with local SQLite
✅ Turso database URL configured: `libsql://learning-management-dhanraj.aws-ap-northeast-1.turso.io`
⏳ Waiting for Turso authentication to complete

## Next Steps

### 1. Complete Turso Login

A browser window should have opened for Turso authentication. Please:

1. Complete the authentication in your browser
2. Wait for the terminal to show "Logged in successfully"

### 2. Get Your Auth Token

Once logged in, run:

```bash
cd backend
turso db tokens create learning-management
```

Copy the token that is displayed.

### 3. Update .env File

Edit `backend/.env` and replace `PLEASE_ADD_YOUR_TOKEN_HERE` with your actual token:

```bash
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...YOUR_ACTUAL_TOKEN
```

### 4. Restart the Backend Server

```bash
cd backend
go run cmd/server/main.go
```

### 5. Test the Connection

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

## Alternative: Continue with Local SQLite

If you prefer to continue testing with local SQLite first, update `.env`:

```bash
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=not-needed-for-local
```

Then run the server and it will use the local database.

## What's Next

Once the backend is connected to Turso:

1. Seed the database with DSA topics, certifications, etc.
2. Integrate the frontend to use API endpoints
3. Test the full application flow
