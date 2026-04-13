#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐾 PingPanther Docker Setup${NC}"
echo "================================"

# Check if .env exists, create from example if not
if [ ! -f .env ]; then
    echo -e "${YELLOW}📄 .env file not found, creating from .env.example...${NC}"
    cp .env.example .env

    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -hex 32)
    REDIS_PASSWORD=$(openssl rand -hex 32)
    APP_KEY=$(php -r "echo 'base64:'.base64_encode(random_bytes(32));" 2>/dev/null || echo "")

    # If php not available, use fallback
    if [ -z "$APP_KEY" ]; then
        APP_KEY="base64:$(openssl rand -base64 32)"
    fi

    # Update .env with generated values
    if grep -q "^DB_PASSWORD=" .env; then
        sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env && rm -f .env.bak
    else
        echo "DB_PASSWORD=$DB_PASSWORD" >> .env
    fi

    if grep -q "^REDIS_PASSWORD=" .env; then
        sed -i.bak "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" .env && rm -f .env.bak
    else
        echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> .env
    fi

    if grep -q "^APP_KEY=" .env; then
        sed -i.bak "s/^APP_KEY=.*/APP_KEY=$APP_KEY/" .env && rm -f .env.bak
    else
        echo "APP_KEY=$APP_KEY" >> .env
    fi

    echo -e "${GREEN}✅ Generated secure passwords and APP_KEY${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"

    # Check if required variables are set
    if ! grep -q "^DB_PASSWORD=" .env || [ -z "$(grep "^DB_PASSWORD=" .env | cut -d'=' -f2)" ]; then
        DB_PASSWORD=$(openssl rand -hex 32)
        if grep -q "^DB_PASSWORD=" .env; then
            sed -i.bak "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env && rm -f .env.bak
        else
            echo "DB_PASSWORD=$DB_PASSWORD" >> .env
        fi
        echo -e "${YELLOW}🔑 Generated DB_PASSWORD${NC}"
    fi

    if ! grep -q "^REDIS_PASSWORD=" .env || [ -z "$(grep "^REDIS_PASSWORD=" .env | cut -d'=' -f2)" ]; then
        REDIS_PASSWORD=$(openssl rand -hex 32)
        if grep -q "^REDIS_PASSWORD=" .env; then
            sed -i.bak "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$REDIS_PASSWORD/" .env && rm -f .env.bak
        else
            echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> .env
        fi
        echo -e "${YELLOW}🔑 Generated REDIS_PASSWORD${NC}"
    fi

    if ! grep -q "^APP_KEY=" .env || [ -z "$(grep "^APP_KEY=" .env | cut -d'=' -f2)" ]; then
        APP_KEY=$(php -r "echo 'base64:'.base64_encode(random_bytes(32));" 2>/dev/null || echo "base64:$(openssl rand -base64 32)")
        if grep -q "^APP_KEY=" .env; then
            sed -i.bak "s/^APP_KEY=.*/APP_KEY=$APP_KEY/" .env && rm -f .env.bak
        else
            echo "APP_KEY=$APP_KEY" >> .env
        fi
        echo -e "${YELLOW}🔑 Generated APP_KEY${NC}"
    fi
fi

# Ensure required variables are set in .env
ensure_env_var() {
    local var_name=$1
    local default_value=$2
    
    if ! grep -q "^${var_name}=" .env 2>/dev/null || [ -z "$(grep "^${var_name}=" .env | cut -d'=' -f2)" ]; then
        if grep -q "^${var_name}=" .env 2>/dev/null; then
            sed -i.bak "s/^${var_name}=.*/${var_name}=${default_value}/" .env && rm -f .env.bak
        else
            echo "${var_name}=${default_value}" >> .env
        fi
        echo -e "${YELLOW}🔧 Set ${var_name}=${default_value}${NC}"
    fi
}

# Set default values for Docker environment
ensure_env_var "APP_ENV" "local"
ensure_env_var "APP_DEBUG" "true"
ensure_env_var "APP_PORT" "8080"
ensure_env_var "APP_URL" "http://localhost:8080"
ensure_env_var "DB_CONNECTION" "pgsql"
ensure_env_var "DB_HOST" "pingpanther-postgres"
ensure_env_var "DB_PORT" "5432"
ensure_env_var "DB_DATABASE" "pingpanther"
ensure_env_var "DB_USERNAME" "postgres"
ensure_env_var "REDIS_HOST" "pingpanther-redis"
ensure_env_var "REDIS_PORT" "6379"

# Ensure required directories exist
mkdir -p docker
if [ ! -f docker/entrypoint.sh ]; then
    echo -e "${RED}❌ docker/entrypoint.sh not found!${NC}"
    exit 1
fi

# Make entrypoint executable
chmod +x docker/entrypoint.sh

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Stop and remove existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose down -v 2>/dev/null || true

# Build and start containers
echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker compose build --no-cache
docker compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 5

# Check status
echo ""
echo -e "${GREEN}📊 Container Status:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep pingpanther || true

echo ""
echo -e "${GREEN}✅ PingPanther is starting up!${NC}"
echo "📱 App URL: http://localhost:8080"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo "  View logs:     docker compose logs -f app"
echo "  Stop:          docker compose down"
echo "  Restart:       docker compose restart"
echo "  Shell access:  docker compose exec app bash"
