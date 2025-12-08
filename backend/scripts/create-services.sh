#!/bin/bash

# Script to create all remaining microservices
# This creates System Design, AI System Design, Certifications, and Gamification services

set -e

BACKEND_DIR="/Users/dhanraj/Workspace/Learning-Management/backend"
cd "$BACKEND_DIR"

echo "🚀 Creating remaining microservices..."

# Function to create a service template
create_service() {
    local service_name=$1
    local port=$2
    
    echo "Creating $service_name service..."
    mkdir -p "services/$service_name"/{handlers,repository,models}
}

# Create service directories
create_service "system-design" "8083"
create_service "ai-system-design" "8084"
create_service "certifications" "8085"
create_service "gamification" "8086"

echo "✅ Service directories created!"
echo "📝 Next: Copy models, repositories, and handlers from internal/"
