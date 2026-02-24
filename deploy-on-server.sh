#!/bin/bash
set -e

echo "🐋 Starting Docker Deployment on Server..."

IMAGE_NAME="tours-backend"
IMAGE_TAG="latest"
CONTAINER_NAME="tours-backend"
EXPORT_FILE="tours-backend.tar"
ENV_FILE=".env.production"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

if [ ! -f "$EXPORT_FILE" ]; then
    echo -e "${RED}❌ $EXPORT_FILE not found!${NC}"
    exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ $ENV_FILE not found!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📦 Loading Docker image...${NC}"
docker load -i $EXPORT_FILE
echo -e "${GREEN}✅ Docker image loaded!${NC}"

echo -e "\n${YELLOW}🛑 Stopping existing container...${NC}"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
    echo -e "${GREEN}✅ Existing container removed${NC}"
fi

echo -e "\n${YELLOW}🗄️  Running database migrations...${NC}"
docker run --rm --env-file $ENV_FILE $IMAGE_NAME:$IMAGE_TAG sh -c "npx prisma migrate deploy"
echo -e "${GREEN}✅ Database migrations completed${NC}"

echo -e "\n${YELLOW}🚀 Starting new container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file $ENV_FILE \
  $IMAGE_NAME:$IMAGE_TAG

echo -e "${GREEN}✅ Container started!${NC}"

sleep 5

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "\n${CYAN}📋 Recent logs:${NC}"
    docker logs --tail 20 $CONTAINER_NAME
    
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "\n${YELLOW}API URLs:${NC}"
    echo -e "${CYAN}• Health: https://timelessfactors.co.ke:4000/health${NC}"
    echo -e "${CYAN}• Docs:   https://timelessfactors.co.ke:4000/docs${NC}"
    echo -e "${CYAN}• API:    https://timelessfactors.co.ke:4000/api${NC}"
    echo -e "\n${CYAN}========================================${NC}\n"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    exit 1
fi