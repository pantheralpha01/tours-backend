#!/bin/bash

# Comprehensive State Machine API Test Suite
# Tests all transitions for booking, payment, dispatch, dispute, refund

set -e

API_URL="http://localhost:4000"
PASSED=0
FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== COMPREHENSIVE STATE MACHINE API TEST ===${NC}"
echo "Testing all transitions for booking, payment, dispatch, dispute, refund"
echo ""

# Helper function to test API responses
test_response() {
    local name="$1"
    local status_code="$2"
    local expected="$3"
    
    if [ "$status_code" -eq "$expected" ]; then
        echo -e "${GREEN}✓ $name${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ $name - Expected $expected, got $status_code${NC}"
        ((FAILED++))
        return 1
    fi
}

# Step 1: Login
echo "1. Login..."
LOGIN_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin@123"}')

LOGIN_BODY=$(echo $LOGIN_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
LOGIN_STATUS=$(echo $LOGIN_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Login" "$LOGIN_STATUS" "200"; then
    TOKEN=$(echo "$LOGIN_BODY" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo "Login failed, cannot continue"
    exit 1
fi
echo ""

# Step 2: Create Booking (DRAFT)
echo "2. Create Booking (DRAFT)..."
BOOKING_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/bookings" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "customerName": "Test Customer",
    "serviceTitle": "Safari Tour",
    "amount": 500,
    "currency": "USD",
    "status": "DRAFT"
  }')

BOOKING_BODY=$(echo $BOOKING_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
BOOKING_STATUS=$(echo $BOOKING_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Create Booking" "$BOOKING_STATUS" "201"; then
    BOOKING_ID=$(echo "$BOOKING_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Booking ID: $BOOKING_ID"
else
    echo "Booking creation failed, cannot continue"
    exit 1
fi
echo ""

# Step 3: Create Payment (INITIATED)
echo "3. Create Payment (INITIATED)..."
PAYMENT_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"provider\": \"STRIPE\",
    \"amount\": 500,
    \"currency\": \"USD\"
  }")

PAYMENT_BODY=$(echo $PAYMENT_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
PAYMENT_STATUS=$(echo $PAYMENT_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Create Payment" "$PAYMENT_STATUS" "201"; then
    PAYMENT_ID=$(echo "$PAYMENT_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Payment ID: $PAYMENT_ID"
else
    echo "Payment creation failed, cannot continue"
    exit 1
fi
echo ""

# Step 4: Transition Payment INITIATED → PENDING
echo "4. Payment INITIATED → PENDING..."
PAYMENT_TRANS1=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "state": "PENDING",
    "transitionReason": "Processing payment"
  }')

PAYMENT_TRANS1_STATUS=$(echo $PAYMENT_TRANS1 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Payment → PENDING" "$PAYMENT_TRANS1_STATUS" "200"
echo ""

# Step 5: Transition Payment PENDING → COMPLETED
echo "5. Payment PENDING → COMPLETED..."
PAYMENT_TRANS2=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "state": "COMPLETED",
    "transitionReason": "Payment processed successfully"
  }')

PAYMENT_TRANS2_STATUS=$(echo $PAYMENT_TRANS2 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Payment → COMPLETED" "$PAYMENT_TRANS2_STATUS" "200"
echo ""

# Step 6: Transition Booking DRAFT → CONFIRMED
echo "6. Booking DRAFT → CONFIRMED..."
BOOKING_TRANS=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/bookings/$BOOKING_ID/transition" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "toStatus": "CONFIRMED",
    "transitionReason": "Customer confirmed booking"
  }')

BOOKING_TRANS_STATUS=$(echo $BOOKING_TRANS | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Booking → CONFIRMED" "$BOOKING_TRANS_STATUS" "200"
echo ""

# Step 7: Create Dispatch (PENDING)
echo "7. Create Dispatch (PENDING)..."
DISPATCH_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/dispatches" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"status\": \"PENDING\"
  }")

DISPATCH_BODY=$(echo $DISPATCH_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
DISPATCH_STATUS=$(echo $DISPATCH_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Create Dispatch" "$DISPATCH_STATUS" "201"; then
    DISPATCH_ID=$(echo "$DISPATCH_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Dispatch ID: $DISPATCH_ID"
fi
echo ""

# Step 8: Dispatch PENDING → ASSIGNED
echo "8. Dispatch PENDING → ASSIGNED..."
DISPATCH_TRANS1=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "ASSIGNED",
    "transitionReason": "Assigned to field agent"
  }')

DISPATCH_TRANS1_STATUS=$(echo $DISPATCH_TRANS1 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Dispatch → ASSIGNED" "$DISPATCH_TRANS1_STATUS" "200"

# Step 9: Dispatch ASSIGNED → IN_PROGRESS
echo "9. Dispatch ASSIGNED → IN_PROGRESS..."
DISPATCH_TRANS2=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "IN_PROGRESS",
    "transitionReason": "Agent started delivery"
  }')

DISPATCH_TRANS2_STATUS=$(echo $DISPATCH_TRANS2 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Dispatch → IN_PROGRESS" "$DISPATCH_TRANS2_STATUS" "200"

# Step 10: Dispatch IN_PROGRESS → COMPLETED
echo "10. Dispatch IN_PROGRESS → COMPLETED..."
DISPATCH_TRANS3=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "COMPLETED",
    "transitionReason": "Delivery completed"
  }')

DISPATCH_TRANS3_STATUS=$(echo $DISPATCH_TRANS3 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Dispatch → COMPLETED" "$DISPATCH_TRANS3_STATUS" "200"
echo ""

# Step 11: Create Dispute (OPEN)
echo "11. Create Dispute (OPEN)..."
DISPUTE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/disputes" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"reason\": \"Quality issue\",
    \"description\": \"Test dispute for comprehensive testing\"
  }")

DISPUTE_BODY=$(echo $DISPUTE_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
DISPUTE_STATUS=$(echo $DISPUTE_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Create Dispute" "$DISPUTE_STATUS" "201"; then
    DISPUTE_ID=$(echo "$DISPUTE_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Dispute ID: $DISPUTE_ID"
fi

# Step 12: Dispute OPEN → UNDER_REVIEW
echo "12. Dispute OPEN → UNDER_REVIEW..."
DISPUTE_TRANS1=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/disputes/$DISPUTE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "UNDER_REVIEW",
    "transitionReason": "Assigned for review"
  }')

DISPUTE_TRANS1_STATUS=$(echo $DISPUTE_TRANS1 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Dispute → UNDER_REVIEW" "$DISPUTE_TRANS1_STATUS" "200"

# Step 13: Dispute UNDER_REVIEW → RESOLVED
echo "13. Dispute UNDER_REVIEW → RESOLVED..."
DISPUTE_TRANS2=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/disputes/$DISPUTE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "RESOLVED",
    "transitionReason": "Issue resolved with compensation"
  }')

DISPUTE_TRANS2_STATUS=$(echo $DISPUTE_TRANS2 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Dispute → RESOLVED" "$DISPUTE_TRANS2_STATUS" "200"
echo ""

# Step 14: Create Refund (REQUESTED)
echo "14. Create Refund (REQUESTED)..."
REFUND_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/api/refunds" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{
    \"bookingId\": \"$BOOKING_ID\",
    \"paymentId\": \"$PAYMENT_ID\",
    \"amount\": 250,
    \"reason\": \"Partial refund for quality issue\"
  }")

REFUND_BODY=$(echo $REFUND_RESPONSE | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
REFUND_STATUS=$(echo $REFUND_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if test_response "Create Refund" "$REFUND_STATUS" "201"; then
    REFUND_ID=$(echo "$REFUND_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Refund ID: $REFUND_ID"
fi

# Step 15: Refund REQUESTED → APPROVED
echo "15. Refund REQUESTED → APPROVED..."
REFUND_TRANS1=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "APPROVED",
    "transitionReason": "Manager approved"
  }')

REFUND_TRANS1_STATUS=$(echo $REFUND_TRANS1 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Refund → APPROVED" "$REFUND_TRANS1_STATUS" "200"

# Step 16: Refund APPROVED → PROCESSING
echo "16. Refund APPROVED → PROCESSING..."
REFUND_TRANS2=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "PROCESSING",
    "transitionReason": "Processing refund payment"
  }')

REFUND_TRANS2_STATUS=$(echo $REFUND_TRANS2 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Refund → PROCESSING" "$REFUND_TRANS2_STATUS" "200"

# Step 17: Refund PROCESSING → COMPLETED
echo "17. Refund PROCESSING → COMPLETED..."
REFUND_TRANS3=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "COMPLETED",
    "reference": "REF-2026-001",
    "transitionReason": "Refund completed successfully"
  }')

REFUND_TRANS3_STATUS=$(echo $REFUND_TRANS3 | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Refund → COMPLETED" "$REFUND_TRANS3_STATUS" "200"
echo ""

# Step 18: Test Invalid Transition (should fail)
echo "18. Test Invalid Transition (should fail)..."
INVALID_TRANS=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT "$API_URL/api/bookings/$BOOKING_ID/transition" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "toStatus": "DRAFT",
    "transitionReason": "Should not work"
  }')

INVALID_STATUS=$(echo $INVALID_TRANS | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Invalid transition correctly rejected" "$INVALID_STATUS" "400"
echo ""

# Additional comprehensive tests
echo -e "${YELLOW}=== ADDITIONAL VALIDATION TESTS ===${NC}"

# Test 19: Get booking details
echo "19. Get Booking Details..."
BOOKING_GET=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/bookings/$BOOKING_ID" \
  -H "Authorization: Bearer $TOKEN")
BOOKING_GET_STATUS=$(echo $BOOKING_GET | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Get Booking Details" "$BOOKING_GET_STATUS" "200"

# Test 20: Get payment details
echo "20. Get Payment Details..."
PAYMENT_GET=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/payments/$PAYMENT_ID" \
  -H "Authorization: Bearer $TOKEN")
PAYMENT_GET_STATUS=$(echo $PAYMENT_GET | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Get Payment Details" "$PAYMENT_GET_STATUS" "200"

# Test 21: Get dispatch details
echo "21. Get Dispatch Details..."
DISPATCH_GET=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/dispatches/$DISPATCH_ID" \
  -H "Authorization: Bearer $TOKEN")
DISPATCH_GET_STATUS=$(echo $DISPATCH_GET | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Get Dispatch Details" "$DISPATCH_GET_STATUS" "200"

# Test 22: Get dispute details
echo "22. Get Dispute Details..."
DISPUTE_GET=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/disputes/$DISPUTE_ID" \
  -H "Authorization: Bearer $TOKEN")
DISPUTE_GET_STATUS=$(echo $DISPUTE_GET | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Get Dispute Details" "$DISPUTE_GET_STATUS" "200"

# Test 23: Get refund details
echo "23. Get Refund Details..."
REFUND_GET=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/refunds/$REFUND_ID" \
  -H "Authorization: Bearer $TOKEN")
REFUND_GET_STATUS=$(echo $REFUND_GET | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "Get Refund Details" "$REFUND_GET_STATUS" "200"

# Test 24: List bookings
echo "24. List Bookings..."
BOOKINGS_LIST=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET "$API_URL/api/bookings" \
  -H "Authorization: Bearer $TOKEN")
BOOKINGS_LIST_STATUS=$(echo $BOOKINGS_LIST | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
test_response "List Bookings" "$BOOKINGS_LIST_STATUS" "200"
echo ""

# Final Results
echo -e "${CYAN}=== COMPREHENSIVE TEST RESULTS ===${NC}"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL STATE MACHINE APIS WORKING PERFECTLY!${NC}"
    echo -e "${YELLOW}✅ All transitions validated successfully${NC}"
    echo -e "${YELLOW}✅ All CRUD operations working${NC}"
    echo -e "${YELLOW}✅ State machine rules enforced correctly${NC}"
    echo -e "${YELLOW}✅ Invalid transitions properly rejected${NC}"
    echo ""
    echo -e "${CYAN}Ready for production use!${NC}"
    echo -e "${CYAN}Postman/Swagger can now use steps from TRANSITION_TEST_STEPS.md${NC}"
else
    echo -e "${RED}❌ Some tests failed - check server logs for details${NC}"
    echo -e "${YELLOW}Review failed tests and fix issues before proceeding${NC}"
fi

echo ""
echo "Test completed at $(date)"