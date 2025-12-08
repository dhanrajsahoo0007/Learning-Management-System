#!/bin/bash

# Automated script to copy files for remaining microservices
# Run this from the backend directory

set -e

BACKEND_DIR="/Users/dhanraj/Workspace/Learning-Management/backend"
cd "$BACKEND_DIR"

echo "🚀 Copying files for remaining microservices..."

# System Design Service
echo "📦 System Design Service..."
mkdir -p services/system-design/{models,repository,handlers}
cp internal/models/system_design.go services/system-design/models/
cp internal/repository/system_design_repository.go services/system-design/repository/
cp internal/handlers/system_design_handler.go services/system-design/handlers/

# AI System Design Service (copy from system-design)
echo "📦 AI System Design Service..."
mkdir -p services/ai-system-design/{models,repository,handlers}
cp services/system-design/models/system_design.go services/ai-system-design/models/
cp services/system-design/repository/system_design_repository.go services/ai-system-design/repository/
cp services/system-design/handlers/system_design_handler.go services/ai-system-design/handlers/

# Certifications Service
echo "📦 Certifications Service..."
mkdir -p services/certifications/{models,repository,handlers}
cp internal/models/certification.go services/certifications/models/
cp internal/repository/certification_repository.go services/certifications/repository/
cp internal/handlers/certification_handler.go services/certifications/handlers/

# Gamification Service
echo "📦 Gamification Service..."
mkdir -p services/gamification/{models,repository,handlers}
cp internal/models/gamification.go services/gamification/models/
cp internal/repository/gamification_repository.go services/gamification/repository/
cp internal/handlers/gamification_handler.go services/gamification/handlers/

echo "✅ Files copied successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Update imports in all copied files to use 'services/shared' instead of 'internal'"
echo "2. Create main.go for each service (use services/dsa/main.go as template)"
echo "3. Create go.mod for each service"
echo "4. Create Dockerfile for each service (use services/dsa/Dockerfile as template)"
echo "5. Run 'go mod tidy' in each service directory"
echo ""
echo "See QUICK_SETUP.md for detailed instructions!"
