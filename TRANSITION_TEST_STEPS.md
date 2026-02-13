# State Machine Transition Testing Steps

## Prerequisites
1. Start the dev server: `npm run dev`
2. In a new terminal, make sure the database is seeded: `npx ts-node src/utils/seed.ts`

## ⚠️ CRITICAL TESTING ORDER

**The booking lifecycle requires payments to be completed before booking confirmation. The steps below MUST be followed in exact order for Postman/Swagger success:**

1. Login and get fresh token (expires in 15 minutes)
2. Create booking in DRAFT status  
3. Create payment for that booking
4. Complete the payment workflow (INITIATED → PENDING → COMPLETED)
5. ONLY THEN transition booking to CONFIRMED

## Manual Test Steps Using Postman or curl

### 1. Login
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
**Response:** Save the `accessToken` for the next requests. Use it in the `Authorization: Bearer <token>` header.

---

## BOOKING & PAYMENT WORKFLOW

**⚠️ IMPORTANT:** Bookings require a completed payment before they can be confirmed. Follow this exact order:

### 2. Create Booking (DRAFT)
```
POST http://localhost:4000/api/bookings
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "customerName": "John Doe",
  "serviceTitle": "Safari Tour",
  "amount": 500,
  "currency": "USD",
  "status": "DRAFT"
}
```
**Expected:** 201 status, booking with `status: "DRAFT"`. Save the booking `id`.

### 3. Create Payment (INITIATED)
```
POST http://localhost:4000/api/payments
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "bookingId": "{bookingId}",
  "amount": 500,
  "currency": "USD",
  "state": "INITIATED"
}
```
**Expected:** 201 status. Save the payment `id`.

### 4. Transition Payment INITIATED → PENDING
```
PUT http://localhost:4000/api/payments/{paymentId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "state": "PENDING",
  "transitionReason": "Processing payment"
}
```
**Expected:** 200 status, payment with `state: "PENDING"`

### 5. Transition Payment PENDING → COMPLETED
```
PUT http://localhost:4000/api/payments/{paymentId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "state": "COMPLETED",
  "transitionReason": "Payment processed successfully"
}
```
**Expected:** 200 status, payment with `state: "COMPLETED"`

### 6. NOW Transition Booking DRAFT → CONFIRMED
```
PUT http://localhost:4000/api/bookings/{bookingId}/transition
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "toStatus": "CONFIRMED",
  "transitionReason": "Customer confirmed booking"
}
```
**Expected:** 200 status, booking with `status: "CONFIRMED"`

### 7. Try Invalid Transition CONFIRMED → DRAFT (Should Fail)
```
PUT http://localhost:4000/api/bookings/{bookingId}/transition
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "toStatus": "DRAFT",
  "transitionReason": "Should not work"
}
```
**Expected:** 400 status with error message about invalid transition

---

## DISPATCH TRANSITIONS

### 8. Create Dispatch (PENDING)
```
POST http://localhost:4000/api/dispatches
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "bookingId": "{bookingId}",
  "status": "PENDING"
}
```
**Expected:** 201 status. Save the dispatch `id`.

### 9. Transition Dispatch PENDING → ASSIGNED
```
PUT http://localhost:4000/api/dispatches/{dispatchId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "ASSIGNED",
  "transitionReason": "Assigned to field agent"
}
```
**Expected:** 200 status, dispatch with `status: "ASSIGNED"`

### 10. Transition Dispatch ASSIGNED → IN_PROGRESS
```
PUT http://localhost:4000/api/dispatches/{dispatchId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "transitionReason": "Agent started delivery"
}
```
**Expected:** 200 status, dispatch with `status: "IN_PROGRESS"`

### 11. Transition Dispatch IN_PROGRESS → COMPLETED
```
PUT http://localhost:4000/api/dispatches/{dispatchId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "COMPLETED",
  "transitionReason": "Delivery completed"
}
```
**Expected:** 200 status, dispatch with `status: "COMPLETED"`

---

## DISPUTE TRANSITIONS

### 12. Create Dispute (OPEN)
```
POST http://localhost:4000/api/disputes
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "bookingId": "{bookingId}",
  "reason": "Quality issue",
  "description": "Tour guide was rude"
}
```
**Expected:** 201 status. Save the dispute `id`.

### 13. Transition Dispute OPEN → UNDER_REVIEW
```
PUT http://localhost:4000/api/disputes/{disputeId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "UNDER_REVIEW",
  "transitionReason": "Assigned for review",
  "assignedToId": "1"
}
```
**Expected:** 200 status, dispute with `status: "UNDER_REVIEW"`

### 14. Transition Dispute UNDER_REVIEW → RESOLVED
```
PUT http://localhost:4000/api/disputes/{disputeId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "RESOLVED",
  "transitionReason": "Issue resolved with compensation"
}
```
**Expected:** 200 status, dispute with `status: "RESOLVED"`

---

## REFUND TRANSITIONS

### 15. Create Refund (REQUESTED)
```
POST http://localhost:4000/api/refunds
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "bookingId": "{bookingId}",
  "amount": 250,
  "reason": "Partial refund for quality issue"
}
```
**Expected:** 201 status. Save the refund `id`.

### 16. Transition Refund REQUESTED → APPROVED
```
PUT http://localhost:4000/api/refunds/{refundId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "APPROVED",
  "transitionReason": "Manager approved"
}
```
**Expected:** 200 status, refund with `status: "APPROVED"`

### 17. Transition Refund APPROVED → PROCESSING
```
PUT http://localhost:4000/api/refunds/{refundId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "PROCESSING",
  "transitionReason": "Processing refund payment"
}
```
**Expected:** 200 status, refund with `status: "PROCESSING"`

### 18. Transition Refund PROCESSING → COMPLETED
```
PUT http://localhost:4000/api/refunds/{refundId}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "COMPLETED",
  "reference": "REF-2026-001",
  "transitionReason": "Refund completed successfully"
}
```
**Expected:** 200 status, refund with `status: "COMPLETED"`

---

## Summary

✅ **Valid Transitions Tested:**
- Booking: DRAFT → CONFIRMED → CANCELLED
- Payment: INITIATED → PENDING → COMPLETED
- Dispatch: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
- Dispute: OPEN → UNDER_REVIEW → RESOLVED
- Refund: REQUESTED → APPROVED → PROCESSING → COMPLETED

❌ **Invalid Transitions to Test (Should all return 400):**
- Booking: CONFIRMED → DRAFT
- Payment: COMPLETED → PENDING  
- Dispatch: COMPLETED → CANCELLED
- Dispute: RESOLVED → OPEN
- Refund: COMPLETED → PROCESSING

**Each successful transition will:**
1. Validate the transition against the state machine rules
2. Update the status
3. Log the transition reason in the event metadata
4. Create an audit event in the database

---

## 🔧 Troubleshooting

### Common Issues in Postman/Swagger:

**401 Unauthorized:**
- Token expired (15-minute lifetime) - get fresh token from login
- Missing `Bearer ` prefix in Authorization header
- Token copied incorrectly (extra quotes/spaces)

**400 Bad Request - "Cannot confirm booking without payment":**
- You tried to transition booking DRAFT→CONFIRMED before completing payment
- Follow the exact order: Create booking → Create payment → Complete payment → Confirm booking

**400 Bad Request - "Invalid transition":**
- You're trying an illegal state transition (e.g., CONFIRMED→DRAFT)
- Check the valid transitions in the summary above

**Connection Errors:**
- Dev server not running on port 4000
- Run `npm run dev` from `backend/` folder
- Check `netstat -ano | findstr :4000` to verify server is listening

### For Postman Users:
1. Create a new request collection
2. Set up an environment variable for `baseUrl` = `http://localhost:4000`
3. Set up environment variables for `token`, `bookingId`, `paymentId`, etc.
4. Follow steps 1-6 in exact order, saving IDs as you go

### For Swagger Users:
1. Navigate to `http://localhost:4000/api-docs`
2. Use "Authorize" button with `Bearer <token>` format  
3. Follow the numbered steps in order
4. Copy/paste IDs between requests manually
