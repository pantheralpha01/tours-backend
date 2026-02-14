#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the deployment URL from command line argument or use default
DEPLOYMENT_URL="${1:-http://localhost:4000}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Tours Backend Deployment Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Testing deployment at: ${YELLOW}${DEPLOYMENT_URL}${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    local method=${4:-GET}
    
    echo -n "Testing ${name}... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "${DEPLOYMENT_URL}${url}" 2>&1)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${DEPLOYMENT_URL}${url}" 2>&1)
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: ${response})"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: ${expected_status}, Got: ${response})"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to test endpoint with response body check
test_endpoint_with_body() {
    local name=$1
    local url=$2
    local expected_text=$3
    
    echo -n "Testing ${name}... "
    
    response=$(curl -s "${DEPLOYMENT_URL}${url}" 2>&1)
    
    if echo "$response" | grep -q "$expected_text"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected text not found)"
        echo "Response: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Start tests
echo -e "${BLUE}Running endpoint tests...${NC}"
echo ""

# Test 1: Health check
test_endpoint_with_body "Health Check" "/health" "ok"

# Test 2: API documentation
test_endpoint "API Documentation" "/api-docs" "200"

# Test 3: Auth routes
test_endpoint "Login endpoint exists" "/api/auth/login" "400" "POST"
test_endpoint "Register endpoint exists" "/api/auth/register" "400" "POST"

# Test 4: Tours routes
test_endpoint "Tours list endpoint" "/api/tours" "200"

# Test 5: Bookings routes (should require auth)
test_endpoint "Bookings endpoint (requires auth)" "/api/bookings" "401"

# Test 6: Agents routes (should require auth)
test_endpoint "Agents endpoint (requires auth)" "/api/agents" "401"

# Test 7: Check for 404 on non-existent route
test_endpoint "404 on non-existent route" "/api/nonexistent" "404"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Results${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo ""

# Additional checks
echo -e "${BLUE}Additional Checks:${NC}"
echo ""

# Check Node.js version (if local)
if [ "$DEPLOYMENT_URL" = "http://localhost:4000" ]; then
    echo -n "Node.js version: "
    node --version || echo -e "${YELLOW}Cannot determine (not local)${NC}"
    
    echo -n "NPM version: "
    npm --version || echo -e "${YELLOW}Cannot determine (not local)${NC}"
    
    echo -n "Prisma status: "
    npx prisma --version 2>/dev/null | head -1 || echo -e "${YELLOW}Cannot determine${NC}"
fi

echo ""

# Final result
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ All tests passed! Deployment looks good.${NC}"
    echo -e "${GREEN}========================================${NC}"
    exit 0
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Some tests failed. Please review.${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
fi
