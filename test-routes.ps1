# Quick test to verify the routes are fixed
$API_URL = "http://localhost:4000"

# Step 1: Login
Write-Host "=== Testing Login ===" -ForegroundColor Green
$loginBody = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
$loginResp = Invoke-WebRequest "$API_URL/api/auth/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody `
  -UseBasicParsing
$loginData = $loginResp.Content | ConvertFrom-Json
$token = $loginData.accessToken
Write-Host "Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Step 2: Create booking
Write-Host "Testing Booking Creation" -ForegroundColor Green
$bookingBody = @{
  customerName = "Test"
  serviceTitle = "Tour"
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
Write-Host "Booking created: $bookingId" -ForegroundColor Green

# Step 3: Transition booking using PUT
Write-Host "Testing Booking Transition (PUT)" -ForegroundColor Green
$transitionBody = @{
  toStatus = "CONFIRMED"
  transitionReason = "Customer confirmed"
} | ConvertTo-Json

$transitionResp = Invoke-WebRequest "$API_URL/api/bookings/$bookingId/transition" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $transitionBody `
  -UseBasicParsing
$transitionData = $transitionResp.Content | ConvertFrom-Json
Write-Host "Booking transitioned to: $($transitionData.status)" -ForegroundColor Green

# Step 4: Test Payment create & transition
Write-Host "Testing Payment Transition (PUT)" -ForegroundColor Green
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
Write-Host "Payment created: $paymentId" -ForegroundColor Green

# Transition with PUT
$stateTransitionBody = @{
  state = "PENDING"
  transitionReason = "Processing"
} | ConvertTo-Json

$paymentTransResp = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $stateTransitionBody `
  -UseBasicParsing
$paymentTransData = $paymentTransResp.Content | ConvertFrom-Json
Write-Host "Payment transitioned to: $($paymentTransData.state)" -ForegroundColor Green

Write-Host "All tests complete!" -ForegroundColor Cyan
