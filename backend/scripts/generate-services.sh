#!/bin/bash

# Script to generate microservices structure
# This creates all necessary files for each microservice

set -e

BACKEND_DIR="/Users/dhanraj/Workspace/Learning-Management/backend"
SERVICES_DIR="$BACKEND_DIR/services"

echo "🚀 Generating microservices structure..."

# Create service directories
for service in dsa system-design ai-system-design certifications gamification gateway; do
    echo "Creating $service service structure..."
    mkdir -p "$SERVICES_DIR/$service"/{handlers,repository,models}
done

echo "✅ Microservices structure created successfully!"
