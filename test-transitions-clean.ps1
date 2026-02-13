Write-Host "=== State Machine Transition Tests ===" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:4000"
$passed = 0
$failed = 0

# Login
Write-Host "Test 1: Login"
$loginBody = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
$loginResp = Invoke-WebRequest "$API_URL/api/auth/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody `
  -UseBasicParsing
$token = ($loginResp.Content | ConvertFrom-Json).accessToken
Write-Host "PASS: Logged in" -ForegroundColor Green
$passed++

# Create booking
Write-Host ""
Write-Host "Test 2: Create Booking"
$bookingBody = @{
  customerName = "John Doe"
  serviceTitle = "Test Tour"
  amount = 500
  currency = "USD"
  status = "DRAFT"
} | ConvertTo-Json

$bookingResp = Invoke-WebRequest "$API_URL/api/bookings" -Method POST `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $bookingBody `
  -UseBasicParsing
$bookingData = $bookingResp.Content | ConvertFrom-Json
$bookingId = $bookingData.id
Write-Host "PASS: Booking created $bookingId with status $($bookingData.status)" -ForegroundColor Green
$passed++

# Create payment
Write-Host ""
Write-Host "Test 3: Create Payment"
$paymentBody = @{
  bookingId = $bookingId
  amount = 500
  currency = "USD"
  state = "INITIATED"
} | ConvertTo-Json

$paymentResp = Invoke-WebRequest "$API_URL/api/payments" -Method POST `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $paymentBody `
  -UseBasicParsing
$paymentData = $paymentResp.Content | ConvertFrom-Json
$paymentId = $paymentData.id
Write-Host "PASS: Payment created $paymentId with state $($paymentData.state)" -ForegroundColor Green
$passed++

# Test booking transition
Write-Host ""
Write-Host "Test 4: Booking Transition PUT" 
$transitionBody = @{
  toStatus = "CONFIRMED"
  transitionReason = "Customer confirmed"
} | ConvertTo-Json

$transitionResp = Invoke-WebRequest "$API_URL/api/bookings/$bookingId/transition" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $transitionBody `
  -UseBasicParsing
$transitionData = $transitionResp.Content | ConvertFrom-Json
Write-Host "PASS: Booking transitioned to $($transitionData.status)" -ForegroundColor Green
$passed++

# Test payment transition
Write-Host ""
Write-Host "Test 5: Payment Transition PUT"
$stateBody = @{state = "PENDING"; transitionReason = "Processing"} | ConvertTo-Json
$paymentTransResp = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $stateBody `
  -UseBasicParsing
$paymentTransData = $paymentTransResp.Content | ConvertFrom-Json
Write-Host "PASS: Payment transitioned to $($paymentTransData.state)" -ForegroundColor Green
$passed++

# Complete payment
Write-Host ""
Write-Host "Test 6: Payment to COMPLETED"
$stateBody2 = @{state = "COMPLETED"; transitionReason = "Success"} | ConvertTo-Json
$paymentTransResp2 = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $stateBody2 `
  -UseBasicParsing
$paymentTransData2 = $paymentTransResp2.Content | ConvertFrom-Json
Write-Host "PASS: Payment transitioned to $($paymentTransData2.state)" -ForegroundColor Green
$passed++

Write-Host ""
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor Cyan
