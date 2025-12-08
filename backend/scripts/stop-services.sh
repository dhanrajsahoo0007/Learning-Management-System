#!/bin/bash

# Stop all microservices

echo "🛑 Stopping all microservices..."

# Kill all Go processes running our services
pkill -f "go run.*services/gateway"
pkill -f "go run.*services/dsa"
pkill -f "go run.*services/system-design"
pkill -f "go run.*services/ai-system-design"
pkill -f "go run.*services/certifications"
pkill -f "go run.*services/gamification"
pkill -f "go run.*services/webhooks"

# Also kill any processes on our ports (removed 8081 for auth, added 8087 for webhooks)
lsof -ti:8080,8082,8083,8084,8085,8086,8087 | xargs kill -9 2>/dev/null || true

echo "✅ All microservices stopped"
