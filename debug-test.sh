#!/bin/bash

set -x  # Enable debug output

API_URL="http://localhost:4000"

echo "=== Step 1: Login ==="
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin@123"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE"
echo ""

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Extracted Token: $TOKEN"
echo ""

if [ -z "$TOKEN" ]; then
  echo "ERROR: No token extracted!"
  exit 1
fi

echo "=== Step 2: Create Booking ==="
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

echo "Booking Response:"
echo "$BOOKING_RESPONSE"
echo ""

BOOKING_ID=$(echo "$BOOKING_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Extracted Booking ID: $BOOKING_ID"
echo ""

if [ -z "$BOOKING_ID" ]; then
  echo "ERROR: No booking ID extracted!"
  exit 1
fi

echo "=== Step 3: Transition Booking DRAFT -> CONFIRMED ==="
echo "URL: $API_URL/api/bookings/$BOOKING_ID/transition"
echo "Token: $TOKEN"
echo ""

TRANSITION_RESPONSE=$(curl -s -X PUT "$API_URL/api/bookings/$BOOKING_ID/transition" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "toStatus": "CONFIRMED",
    "transitionReason": "Customer confirmed booking"
  }')

echo "Transition Response:"
echo "$TRANSITION_RESPONSE"
echo ""

echo "=== Test Complete ==="
