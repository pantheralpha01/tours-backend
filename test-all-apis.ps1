Write-Host "=== COMPREHENSIVE STATE MACHINE API TEST ===" -ForegroundColor Cyan
Write-Host "Testing all transitions for booking, payment, dispatch, dispute, refund" -ForegroundColor Yellow
Write-Host ""

$API_URL = "http://localhost:4000"
$passed = 0
$failed = 0

function Test-Request {
    param($name, $response, $expectedStatus = 200)
    
    if ($response.StatusCode -eq $expectedStatus) {
        Write-Host "✓ $name" -ForegroundColor Green
        $script:passed++
        return $response
    } else {
        Write-Host "✗ $name - Expected $expectedStatus, got $($response.StatusCode)" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

try {
    # 1. Login
    Write-Host "1. Login..." -ForegroundColor White
    $loginBody = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
    $loginResp = Invoke-WebRequest "$API_URL/api/auth/login" -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody -UseBasicParsing
    Test-Request "Login" $loginResp 200
    $token = ($loginResp.Content | ConvertFrom-Json).accessToken
    Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Gray
    Write-Host ""

    # 2. Create booking (DRAFT)
    Write-Host "2. Create Booking (DRAFT)..." -ForegroundColor White
    $bookingBody = @{
        customerName = "Test Customer"
        serviceTitle = "Safari Tour"
        amount = 500
        currency = "USD"
        status = "DRAFT"
    } | ConvertTo-Json
    $bookingResp = Invoke-WebRequest "$API_URL/api/bookings" -Method POST `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $bookingBody -UseBasicParsing
    Test-Request "Create Booking" $bookingResp 201
    $bookingData = $bookingResp.Content | ConvertFrom-Json
    $bookingId = $bookingData.id
    Write-Host "Booking ID: $bookingId" -ForegroundColor Gray
    Write-Host ""

    # 3. Create payment (INITIATED)
    Write-Host "3. Create Payment (INITIATED)..." -ForegroundColor White
    $paymentBody = @{
        bookingId = $bookingId
        amount = 500
        currency = "USD"
        state = "INITIATED"
    } | ConvertTo-Json
    $paymentResp = Invoke-WebRequest "$API_URL/api/payments" -Method POST `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $paymentBody -UseBasicParsing
    Test-Request "Create Payment" $paymentResp 201
    $paymentData = $paymentResp.Content | ConvertFrom-Json
    $paymentId = $paymentData.id
    Write-Host "Payment ID: $paymentId" -ForegroundColor Gray
    Write-Host ""

    # 4. Transition payment INITIATED → PENDING
    Write-Host "4. Payment INITIATED → PENDING..." -ForegroundColor White
    $stateBody1 = @{state = "PENDING"; transitionReason = "Processing"} | ConvertTo-Json
    $paymentTrans1 = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $stateBody1 -UseBasicParsing
    Test-Request "Payment → PENDING" $paymentTrans1 200
    Write-Host ""

    # 5. Transition payment PENDING → COMPLETED
    Write-Host "5. Payment PENDING → COMPLETED..." -ForegroundColor White
    $stateBody2 = @{state = "COMPLETED"; transitionReason = "Success"} | ConvertTo-Json
    $paymentTrans2 = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $stateBody2 -UseBasicParsing
    Test-Request "Payment → COMPLETED" $paymentTrans2 200
    Write-Host ""

    # 6. Transition booking DRAFT → CONFIRMED
    Write-Host "6. Booking DRAFT → CONFIRMED..." -ForegroundColor White
    $transitionBody = @{toStatus = "CONFIRMED"; transitionReason = "Customer confirmed"} | ConvertTo-Json
    $bookingTrans = Invoke-WebRequest "$API_URL/api/bookings/$bookingId/transition" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $transitionBody -UseBasicParsing
    Test-Request "Booking → CONFIRMED" $bookingTrans 200
    Write-Host ""

    # 7. Create dispatch (PENDING)
    Write-Host "7. Create Dispatch (PENDING)..." -ForegroundColor White
    $dispatchBody = @{bookingId = $bookingId; status = "PENDING"} | ConvertTo-Json
    $dispatchResp = Invoke-WebRequest "$API_URL/api/dispatches" -Method POST `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $dispatchBody -UseBasicParsing
    Test-Request "Create Dispatch" $dispatchResp 201
    $dispatchData = $dispatchResp.Content | ConvertFrom-Json
    $dispatchId = $dispatchData.id
    Write-Host "Dispatch ID: $dispatchId" -ForegroundColor Gray
    Write-Host ""

    # 8. Dispatch transitions: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
    Write-Host "8. Dispatch PENDING → ASSIGNED..." -ForegroundColor White
    $dispatchTrans1 = @{status = "ASSIGNED"; transitionReason = "Assigned to agent"} | ConvertTo-Json
    $dispatchResp1 = Invoke-WebRequest "$API_URL/api/dispatches/$dispatchId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $dispatchTrans1 -UseBasicParsing
    Test-Request "Dispatch → ASSIGNED" $dispatchResp1 200

    Write-Host "9. Dispatch ASSIGNED → IN_PROGRESS..." -ForegroundColor White
    $dispatchTrans2 = @{status = "IN_PROGRESS"; transitionReason = "Agent started"} | ConvertTo-Json
    $dispatchResp2 = Invoke-WebRequest "$API_URL/api/dispatches/$dispatchId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $dispatchTrans2 -UseBasicParsing
    Test-Request "Dispatch → IN_PROGRESS" $dispatchResp2 200

    Write-Host "10. Dispatch IN_PROGRESS → COMPLETED..." -ForegroundColor White
    $dispatchTrans3 = @{status = "COMPLETED"; transitionReason = "Delivery done"} | ConvertTo-Json
    $dispatchResp3 = Invoke-WebRequest "$API_URL/api/dispatches/$dispatchId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $dispatchTrans3 -UseBasicParsing
    Test-Request "Dispatch → COMPLETED" $dispatchResp3 200
    Write-Host ""

    # 9. Create dispute (OPEN)
    Write-Host "11. Create Dispute (OPEN)..." -ForegroundColor White
    $disputeBody = @{
        bookingId = $bookingId
        reason = "Quality issue"
        description = "Test dispute"
    } | ConvertTo-Json
    $disputeResp = Invoke-WebRequest "$API_URL/api/disputes" -Method POST `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $disputeBody -UseBasicParsing
    Test-Request "Create Dispute" $disputeResp 201
    $disputeData = $disputeResp.Content | ConvertFrom-Json
    $disputeId = $disputeData.id
    Write-Host "Dispute ID: $disputeId" -ForegroundColor Gray

    # 10. Dispute transitions: OPEN → UNDER_REVIEW → RESOLVED
    Write-Host "12. Dispute OPEN → UNDER_REVIEW..." -ForegroundColor White
    $disputeTrans1 = @{status = "UNDER_REVIEW"; transitionReason = "Reviewing"} | ConvertTo-Json
    $disputeResp1 = Invoke-WebRequest "$API_URL/api/disputes/$disputeId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $disputeTrans1 -UseBasicParsing
    Test-Request "Dispute → UNDER_REVIEW" $disputeResp1 200

    Write-Host "13. Dispute UNDER_REVIEW → RESOLVED..." -ForegroundColor White
    $disputeTrans2 = @{status = "RESOLVED"; transitionReason = "Issue fixed"} | ConvertTo-Json
    $disputeResp2 = Invoke-WebRequest "$API_URL/api/disputes/$disputeId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $disputeTrans2 -UseBasicParsing
    Test-Request "Dispute → RESOLVED" $disputeResp2 200
    Write-Host ""

    # 11. Create refund (REQUESTED)
    Write-Host "14. Create Refund (REQUESTED)..." -ForegroundColor White
    $refundBody = @{
        bookingId = $bookingId
        amount = 250
        reason = "Partial refund"
    } | ConvertTo-Json
    $refundResp = Invoke-WebRequest "$API_URL/api/refunds" -Method POST `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $refundBody -UseBasicParsing
    Test-Request "Create Refund" $refundResp 201
    $refundData = $refundResp.Content | ConvertFrom-Json
    $refundId = $refundData.id
    Write-Host "Refund ID: $refundId" -ForegroundColor Gray

    # 12. Refund transitions: REQUESTED → APPROVED → PROCESSING → COMPLETED
    Write-Host "15. Refund REQUESTED → APPROVED..." -ForegroundColor White
    $refundTrans1 = @{status = "APPROVED"; transitionReason = "Manager approved"} | ConvertTo-Json
    $refundResp1 = Invoke-WebRequest "$API_URL/api/refunds/$refundId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $refundTrans1 -UseBasicParsing
    Test-Request "Refund → APPROVED" $refundResp1 200

    Write-Host "16. Refund APPROVED → PROCESSING..." -ForegroundColor White
    $refundTrans2 = @{status = "PROCESSING"; transitionReason = "Processing refund"} | ConvertTo-Json
    $refundResp2 = Invoke-WebRequest "$API_URL/api/refunds/$refundId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $refundTrans2 -UseBasicParsing
    Test-Request "Refund → PROCESSING" $refundResp2 200

    Write-Host "17. Refund PROCESSING → COMPLETED..." -ForegroundColor White
    $refundTrans3 = @{status = "COMPLETED"; reference = "REF-001"; transitionReason = "Done"} | ConvertTo-Json
    $refundResp3 = Invoke-WebRequest "$API_URL/api/refunds/$refundId" -Method PUT `
        -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
        -Body $refundTrans3 -UseBasicParsing
    Test-Request "Refund → COMPLETED" $refundResp3 200
    Write-Host ""

    # 13. Test invalid transition (should fail)
    Write-Host "18. Test Invalid Transition (should fail)..." -ForegroundColor White
    try {
        $invalidTrans = @{toStatus = "DRAFT"; transitionReason = "Should fail"} | ConvertTo-Json
        $invalidResp = Invoke-WebRequest "$API_URL/api/bookings/$bookingId/transition" -Method PUT `
            -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
            -Body $invalidTrans -UseBasicParsing
        Write-Host "✗ Invalid transition should have failed but got $($invalidResp.StatusCode)" -ForegroundColor Red
        $failed++
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✓ Invalid transition correctly rejected (400)" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "✗ Unexpected error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
            $failed++
        }
    }

} catch {
    Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "=== FINAL RESULTS ===" -ForegroundColor Cyan
Write-Host "✓ Passed: $passed" -ForegroundColor Green
Write-Host "✗ Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "ALL STATE MACHINE APIS WORKING PERFECTLY!" -ForegroundColor Green
    Write-Host "Ready for Postman/Swagger testing using TRANSITION_TEST_STEPS.md" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Some tests failed - check server logs" -ForegroundColor Red
}