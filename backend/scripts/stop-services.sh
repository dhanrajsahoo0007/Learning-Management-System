#!/bin/bash

# Stop all microservices

echo "🛑 Stopping all microservices..."

# Kill all Go processes running our services
pkill -f "go run.*services/gateway"
pkill -f "go run.*services/auth"
pkill -f "go run.*services/dsa"
pkill -f "go run.*services/system-design"
pkill -f "go run.*services/ai-system-design"
pkill -f "go run.*services/certifications"
pkill -f "go run.*services/gamification"

# Also kill any processes on our ports
lsof -ti:8080,8081,8082,8083,8084,8085,8086 | xargs kill -9 2>/dev/null || true

echo "✅ All microservices stopped"
