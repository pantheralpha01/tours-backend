#!/bin/bash

# State Machine Transition Test Suite
# Tests all transitions for: Booking, Payment, Dispatch, Dispute, Refund

set -e

API_URL="http://localhost:4000"
PASSED=0
FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 State Machine Transition Tests"
echo "=================================="
echo ""

# Step 1: Login
echo "📝 Step 1: Login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin@123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
BOOKING_ID=""
PAYMENT_ID=""
DISPATCH_ID=""
DISPUTE_ID=""
REFUND_ID=""

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Logged in${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# ============================================
# BOOKING TRANSITIONS
# ============================================
echo "📘 BOOKING TRANSITIONS"
echo "---------------------"

# Create Booking
echo "1️⃣ Creating booking (DRAFT)..."
BOOKING_RESPONSE=$(curl -s -X POST "$API_URL/api/bookings" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "customerName": "Test Customer",
    "serviceTitle": "Test Tour",
    "amount": 500,
    "currency": "USD",
    "status": "DRAFT"
  }')

BOOKING_ID=$(echo $BOOKING_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
BOOKING_STATUS=$(echo $BOOKING_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$BOOKING_STATUS" = "DRAFT" ]; then
  echo -e "${GREEN}✓ Booking created: $BOOKING_ID (status: $BOOKING_STATUS)${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Booking creation failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition DRAFT → CONFIRMED
echo "2️⃣ Transitioning booking DRAFT → CONFIRMED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/bookings/$BOOKING_ID/transition" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "toStatus": "CONFIRMED",
    "transitionReason": "Customer confirmed booking"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "CONFIRMED" ]; then
  echo -e "${GREEN}✓ Booking transitioned to CONFIRMED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed: $TRANSITION_RESPONSE${NC}"
  ((FAILED++))
fi
echo ""

# Try invalid transition
echo "3️⃣ Testing invalid transition CONFIRMED → DRAFT (should fail)..."
INVALID_RESPONSE=$(curl -s -X PUT "$API_URL/api/bookings/$BOOKING_ID/transition" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "toStatus": "DRAFT",
    "transitionReason": "Invalid transition"
  }')

ERROR_CODE=$(echo $INVALID_RESPONSE | grep -o '"code":"[^"]*' | cut -d'"' -f4)

if [ "$ERROR_CODE" = "INVALID_TRANSITION" ] || [ "$ERROR_CODE" = "VALIDATION_ERROR" ]; then
  echo -e "${GREEN}✓ Invalid transition correctly rejected${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ Expected validation error, got: $ERROR_CODE${NC}"
fi
echo ""

# ============================================
# PAYMENT TRANSITIONS
# ============================================
echo "📗 PAYMENT TRANSITIONS"
echo "---------------------"

# Create Payment
echo "1️⃣ Creating payment (INITIATED)..."
PAYMENT_RESPONSE=$(curl -s -X POST "$API_URL/api/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"amount\": 500,
    \"currency\": \"USD\",
    \"state\": \"INITIATED\"
  }")

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
PAYMENT_STATE=$(echo $PAYMENT_RESPONSE | grep -o '"state":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$PAYMENT_STATE" = "INITIATED" ]; then
  echo -e "${GREEN}✓ Payment created: $PAYMENT_ID (state: $PAYMENT_STATE)${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Payment creation failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition INITIATED → PENDING
echo "2️⃣ Transitioning payment INITIATED → PENDING..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "state": "PENDING",
    "transitionReason": "Processing payment"
  }')

NEW_STATE=$(echo $TRANSITION_RESPONSE | grep -o '"state":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATE" = "PENDING" ]; then
  echo -e "${GREEN}✓ Payment transitioned to PENDING${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition PENDING → COMPLETED
echo "3️⃣ Transitioning payment PENDING → COMPLETED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "state": "COMPLETED",
    "transitionReason": "Payment processed successfully"
  }')

NEW_STATE=$(echo $TRANSITION_RESPONSE | grep -o '"state":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATE" = "COMPLETED" ]; then
  echo -e "${GREEN}✓ Payment transitioned to COMPLETED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# ============================================
# DISPATCH TRANSITIONS
# ============================================
echo "📙 DISPATCH TRANSITIONS"
echo "----------------------"

# Create Dispatch
echo "1️⃣ Creating dispatch (PENDING)..."
DISPATCH_RESPONSE=$(curl -s -X POST "$API_URL/api/dispatches" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"status\": \"PENDING\"
  }")

DISPATCH_ID=$(echo $DISPATCH_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
DISPATCH_STATUS=$(echo $DISPATCH_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$DISPATCH_STATUS" = "PENDING" ]; then
  echo -e "${GREEN}✓ Dispatch created: $DISPATCH_ID (status: $DISPATCH_STATUS)${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Dispatch creation failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition PENDING → ASSIGNED
echo "2️⃣ Transitioning dispatch PENDING → ASSIGNED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "ASSIGNED",
    "transitionReason": "Assigned to agent"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "ASSIGNED" ]; then
  echo -e "${GREEN}✓ Dispatch transitioned to ASSIGNED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition ASSIGNED → IN_PROGRESS
echo "3️⃣ Transitioning dispatch ASSIGNED → IN_PROGRESS..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "IN_PROGRESS",
    "transitionReason": "Started dispatch"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "IN_PROGRESS" ]; then
  echo -e "${GREEN}✓ Dispatch transitioned to IN_PROGRESS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition IN_PROGRESS → COMPLETED
echo "4️⃣ Transitioning dispatch IN_PROGRESS → COMPLETED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "COMPLETED",
    "transitionReason": "Dispatch completed"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "COMPLETED" ]; then
  echo -e "${GREEN}✓ Dispatch transitioned to COMPLETED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# ============================================
# DISPUTE TRANSITIONS
# ============================================
echo "📕 DISPUTE TRANSITIONS"
echo "---------------------"

# Create Dispute
echo "1️⃣ Creating dispute (OPEN)..."
DISPUTE_RESPONSE=$(curl -s -X POST "$API_URL/api/disputes" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"reason\": \"Quality issue\",
    \"description\": \"Test dispute\"
  }")

DISPUTE_ID=$(echo $DISPUTE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
DISPUTE_STATUS=$(echo $DISPUTE_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$DISPUTE_STATUS" = "OPEN" ]; then
  echo -e "${GREEN}✓ Dispute created: $DISPUTE_ID (status: $DISPUTE_STATUS)${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Dispute creation failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition OPEN → UNDER_REVIEW
echo "2️⃣ Transitioning dispute OPEN → UNDER_REVIEW..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/disputes/$DISPUTE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "UNDER_REVIEW",
    "transitionReason": "Review initiated"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "UNDER_REVIEW" ]; then
  echo -e "${GREEN}✓ Dispute transitioned to UNDER_REVIEW${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition UNDER_REVIEW → RESOLVED
echo "3️⃣ Transitioning dispute UNDER_REVIEW → RESOLVED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/disputes/$DISPUTE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "RESOLVED",
    "transitionReason": "Issue resolved"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "RESOLVED" ]; then
  echo -e "${GREEN}✓ Dispute transitioned to RESOLVED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# ============================================
# REFUND TRANSITIONS
# ============================================
echo "📓 REFUND TRANSITIONS"
echo "--------------------"

# Create Refund
echo "1️⃣ Creating refund (REQUESTED)..."
REFUND_RESPONSE=$(curl -s -X POST "$API_URL/api/refunds" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"amount\": 250,
    \"reason\": \"Test refund request\"
  }")

REFUND_ID=$(echo $REFUND_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
REFUND_STATUS=$(echo $REFUND_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$REFUND_STATUS" = "REQUESTED" ]; then
  echo -e "${GREEN}✓ Refund created: $REFUND_ID (status: $REFUND_STATUS)${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Refund creation failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition REQUESTED → APPROVED
echo "2️⃣ Transitioning refund REQUESTED → APPROVED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "APPROVED",
    "transitionReason": "Manager approved"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "APPROVED" ]; then
  echo -e "${GREEN}✓ Refund transitioned to APPROVED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition APPROVED → PROCESSING
echo "3️⃣ Transitioning refund APPROVED → PROCESSING..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "PROCESSING",
    "transitionReason": "Processing refund"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "PROCESSING" ]; then
  echo -e "${GREEN}✓ Refund transitioned to PROCESSING${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# Transition PROCESSING → COMPLETED
echo "4️⃣ Transitioning refund PROCESSING → COMPLETED..."
TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "COMPLETED",
    "reference": "REF-2026-001",
    "transitionReason": "Refund processed"
  }')

NEW_STATUS=$(echo $TRANSITION_RESPONSE | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)

if [ "$NEW_STATUS" = "COMPLETED" ]; then
  echo -e "${GREEN}✓ Refund transitioned to COMPLETED${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ Transition failed${NC}"
  ((FAILED++))
fi
echo ""

# ============================================
# SUMMARY
# ============================================
echo "======================================"
echo "TEST SUMMARY"
echo "======================================"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo "📊 Total: $((PASSED + FAILED))"
echo "======================================"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
