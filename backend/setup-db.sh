#!/bin/bash

# ==============================================================================
# BERESIDE - Local Database Environment Setup Script
# ==============================================================================

# Exit on error
set -e

# Color codes for clean console output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================================${NC}"
echo -e "${CYAN}   BERESIDE - Database Environment Initialization   ${NC}"
echo -e "${CYAN}=====================================================${NC}"

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed on this system.${NC}"
    echo -e "Please install Docker Desktop and try again: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if .env file exists; if not, create it from .env.example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Notice: .env file not found. Copying .env.example to .env...${NC}"
    cp .env.example .env
fi

# Load variables from .env for mapping console outputs
export $(grep -v '^#' .env | xargs)

# Set defaults matching fallback values in docker-compose.yml if not explicitly set
PORT=${PORT:-3000}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-bereside_admin}
DB_NAME=${DB_NAME:-bereside_booking_db}

echo -e "${GREEN}Starting database containers in detached mode...${NC}"
docker compose up -d

echo -e "\n${YELLOW}Waiting for PostgreSQL to be healthy...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
IS_HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTH_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' bereside-postgres 2>/dev/null || echo "\"starting\"")
    
    if [ "$HEALTH_STATUS" = "\"healthy\"" ]; then
        IS_HEALTHY=true
        break
    elif [ "$HEALTH_STATUS" = "\"unhealthy\"" ]; then
        echo -e "${RED}PostgreSQL container health check failed.${NC}"
        docker compose logs postgres
        exit 1
    fi
    
    echo -n "."
    sleep 1
    RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$IS_HEALTHY" = true ]; then
    echo -e "\n${GREEN}PostgreSQL is healthy and ready to accept connections!${NC}"
else
    echo -e "\n${RED}Timeout waiting for PostgreSQL to become healthy.${NC}"
    docker compose logs postgres
    exit 1
fi

echo -e "\n${CYAN}=====================================================${NC}"
echo -e "${GREEN}   Environment is Ready for NestJS Consumption!     ${NC}"
echo -e "${CYAN}=====================================================${NC}"
echo -e "PostgreSQL Host:      ${GREEN}localhost${NC}"
echo -e "PostgreSQL Port:      ${GREEN}${DB_PORT}${NC}"
echo -e "PostgreSQL User:      ${GREEN}${DB_USER}${NC}"
echo -e "PostgreSQL Database:  ${GREEN}${DB_NAME}${NC}"
echo -e "Connection URL:       ${CYAN}postgresql://${DB_USER}:<pwd>@localhost:${DB_PORT}/${DB_NAME}?schema=public${NC}"
echo -e "-----------------------------------------------------"
echo -e "NestJS API Server:    ${CYAN}http://localhost:${PORT}${NC}"
echo -e "====================================================="
