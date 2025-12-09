#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Judge0 Self-Hosted Service...${NC}"

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in your PATH.${NC}"
    echo "Please install Docker Desktop for Mac: https://docs.docker.com/desktop/install/mac-install/"
    exit 1
fi

# 2. Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    # Helper for newer docker versions where compose is a plugin
    if ! docker compose version &> /dev/null; then
        echo -e "${RED}Error: docker-compose is not found.${NC}"
        exit 1
    fi
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Ensure we are in the script's directory (where docker-compose.yml is)
cd "$(dirname "$0")" || exit 1

# 3. Start Services
echo -e "${YELLOW}Spinning up containers...${NC}"
$COMPOSE_CMD up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start containers. Check if Docker is running.${NC}"
    exit 1
fi

# 4. Wait for Health Check
echo -e "${YELLOW}Waiting for Judge0 API to be ready at localhost:2358...${NC}"
MAX_RETRIES=30
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:2358/about &> /dev/null; then
        echo -e "${GREEN}SUCCESS! Judge0 is running.${NC}"
        echo -e "API URL: ${GREEN}http://localhost:2358${NC}"
        echo -e "Update your frontend .env with: VITE_JUDGE0_API_URL=http://localhost:2358"
        exit 0
    fi
    echo -n "."
    sleep 2
    COUNT=$((COUNT+1))
done

echo -e "\n${RED}Timed out waiting for Judge0. Check container logs with: $COMPOSE_CMD logs${NC}"
exit 1
