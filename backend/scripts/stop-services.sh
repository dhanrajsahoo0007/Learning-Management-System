#!/bin/bash

# Stop enabled microservices

if [ -f "$(dirname "$0")/../.env" ]; then
    set -a
    source "$(dirname "$0")/../.env"
    set +a
fi

FEATURE_DSA_ENABLED="${FEATURE_DSA_ENABLED:-false}"
FEATURE_CERTIFICATIONS_ENABLED="${FEATURE_CERTIFICATIONS_ENABLED:-false}"
FEATURE_SYSTEM_DESIGN_ENABLED="${FEATURE_SYSTEM_DESIGN_ENABLED:-true}"
FEATURE_AI_SYSTEM_DESIGN_ENABLED="${FEATURE_AI_SYSTEM_DESIGN_ENABLED:-true}"
FEATURE_GAMIFICATION_ENABLED="${FEATURE_GAMIFICATION_ENABLED:-true}"

echo "Stopping microservices..."

pkill -f "go run.*services/gateway" 2>/dev/null || true
pkill -f "go run.*services/webhooks" 2>/dev/null || true

PORTS="8080,8087"

if [ "$FEATURE_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  pkill -f "go run.*services/system-design" 2>/dev/null || true
  PORTS="$PORTS,8083"
fi

if [ "$FEATURE_AI_SYSTEM_DESIGN_ENABLED" = "true" ]; then
  pkill -f "go run.*services/ai-system-design" 2>/dev/null || true
  PORTS="$PORTS,8084"
fi

if [ "$FEATURE_GAMIFICATION_ENABLED" = "true" ]; then
  pkill -f "go run.*services/gamification" 2>/dev/null || true
  PORTS="$PORTS,8086"
fi

if [ "$FEATURE_DSA_ENABLED" = "true" ]; then
  pkill -f "go run.*services/dsa" 2>/dev/null || true
  PORTS="$PORTS,8082"
fi

if [ "$FEATURE_CERTIFICATIONS_ENABLED" = "true" ]; then
  pkill -f "go run.*services/certifications" 2>/dev/null || true
  PORTS="$PORTS,8085"
fi

# Safe leftovers: pkill returns gracefully if a process is not running
pkill -f "go run.*services/dsa" 2>/dev/null || true
pkill -f "go run.*services/certifications" 2>/dev/null || true

lsof -ti:"$PORTS" | xargs kill -9 2>/dev/null || true

echo "All targeted microservices stopped"
