#!/bin/bash

# Start enabled microservices locally (without Docker)
# Run this script from the backend directory

set -e

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Set service-specific environment variables
export DATABASE_URL=$TURSO_DATABASE_URL
export DATABASE_AUTH_TOKEN=$TURSO_AUTH_TOKEN
export CLERK_SECRET_KEY=$CLERK_SECRET_KEY

FEATURE_DSA_ENABLED="${FEATURE_DSA_ENABLED:-true}"
FEATURE_CERTIFICATIONS_ENABLED="${FEATURE_CERTIFICATIONS_ENABLED:-false}"
FEATURE_SYSTEM_DESIGN_ENABLED="${FEATURE_SYSTEM_DESIGN_ENABLED:-true}"
FEATURE_AI_SYSTEM_DESIGN_ENABLED="${FEATURE_AI_SYSTEM_DESIGN_ENABLED:-true}"
FEATURE_GAMIFICATION_ENABLED="${FEATURE_GAMIFICATION_ENABLED:-true}"

mkdir -p logs

echo "Starting enabled microservices..."
echo ""

# Start Gateway (8080)
echo "Starting API Gateway on port 8080..."
cd services/gateway
export PORT=8080
export DSA_SERVICE_URL=http://localhost:8082
export SYSTEM_DESIGN_SERVICE_URL=http://localhost:8083
export AI_SYSTEM_DESIGN_SERVICE_URL=http://localhost:8084
export CERTIFICATIONS_SERVICE_URL=http://localhost:8085
export GAMIFICATION_SERVICE_URL=http://localhost:8086
export CORS_ALLOWED_ORIGINS=http://localhost:5173
export FEATURE_DSA_ENABLED
export FEATURE_CERTIFICATIONS_ENABLED
export FEATURE_SYSTEM_DESIGN_ENABLED
export FEATURE_AI_SYSTEM_DESIGN_ENABLED
export FEATURE_GAMIFICATION_ENABLED
go run main.go > ../../logs/gateway.log 2>&1 &
echo "Gateway started (PID: $!)"
cd ../..

if [ "$FEATURE_DSA_ENABLED" = "true" ]; then
  echo "Starting DSA Service on port 8082..."
  cd services/dsa
  export PORT=8082
  go run main.go > ../../logs/dsa.log 2>&1 &
  echo "DSA Service started (PID: $!)"
  cd ../..
else
  echo "Skipping DSA Service (FEATURE_DSA_ENABLED=false)"
fi

if [ "$FEATURE_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  echo "Starting System Design Service on port 8083..."
  cd services/system-design
  export PORT=8083
  go run main.go > ../../logs/system-design.log 2>&1 &
  echo "System Design Service started (PID: $!)"
  cd ../..
else
  echo "Skipping System Design Service (FEATURE_SYSTEM_DESIGN_ENABLED=false)"
fi

if [ "$FEATURE_AI_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  echo "Starting AI System Design Service on port 8084..."
  cd services/ai-system-design
  export PORT=8084
  go run main.go > ../../logs/ai-system-design.log 2>&1 &
  echo "AI System Design Service started (PID: $!)"
  cd ../..
else
  echo "Skipping AI System Design Service (FEATURE_AI_SYSTEM_DESIGN_ENABLED=false)"
fi

if [ "$FEATURE_CERTIFICATIONS_ENABLED" = "true" ]; then
  echo "Starting Certifications Service on port 8085..."
  cd services/certifications
  export PORT=8085
  go run main.go > ../../logs/certifications.log 2>&1 &
  echo "Certifications Service started (PID: $!)"
  cd ../..
else
  echo "Skipping Certifications Service (FEATURE_CERTIFICATIONS_ENABLED=false)"
fi

if [ "$FEATURE_GAMIFICATION_ENABLED" = "true" ]; then
  echo "Starting Gamification Service on port 8086..."
  cd services/gamification
  export PORT=8086
  go run main.go > ../../logs/gamification.log 2>&1 &
  echo "Gamification Service started (PID: $!)"
  cd ../..
else
  echo "Skipping Gamification Service (FEATURE_GAMIFICATION_ENABLED=false)"
fi

echo "Starting Webhooks Service on port 8087..."
cd services/webhooks
export PORT=8087
go run main.go > ../../logs/webhooks.log 2>&1 &
echo "Webhooks Service started (PID: $!)"
cd ../..

echo ""
echo "Enabled microservices started"
echo ""
echo "Service Status:"
echo "  - API Gateway:        http://localhost:8080"
if [ "$FEATURE_DSA_ENABLED" = "true" ]; then
  echo "  - DSA Service:        http://localhost:8082"
fi
if [ "$FEATURE_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  echo "  - System Design:      http://localhost:8083"
fi
if [ "$FEATURE_AI_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  echo "  - AI System Design:   http://localhost:8084"
fi
if [ "$FEATURE_CERTIFICATIONS_ENABLED" = "true" ]; then
  echo "  - Certifications:     http://localhost:8085"
fi
if [ "$FEATURE_GAMIFICATION_ENABLED" = "true" ]; then
  echo "  - Gamification:       http://localhost:8086 (Protected)"
fi
echo "  - Webhooks:           http://localhost:8087"
echo ""
echo "Logs are in the logs/ directory"
echo ""
echo "To stop all services, run: ./scripts/stop-services.sh"
