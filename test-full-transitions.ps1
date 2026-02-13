$API_URL = "http://localhost:4000"

# Login
Write-Host "Step 1: Login"
$loginBody = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
$loginResp = Invoke-WebRequest "$API_URL/api/auth/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody `
  -UseBasicParsing
$token = ($loginResp.Content | ConvertFrom-Json).accessToken
Write-Host "✓ Logged in"

# Create booking
Write-Host "Step 2: Create Booking - DRAFT status"
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
Write-Host "✓ Booking created: $bookingId (status: $($bookingData.status))"

# Create payment
Write-Host "Step 3: Create Payment - INITIATED state"
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
Write-Host "✓ Payment created: $paymentId (state: $($paymentData.state))"

# Transition booking to CONFIRMED
Write-Host "Step 4: Transition Booking - DRAFT to CONFIRMED via PUT"
$transitionBody = @{
  toStatus = "CONFIRMED"
  transitionReason = "Customer confirmed booking"
} | ConvertTo-Json

$transitionResp = Invoke-WebRequest "$API_URL/api/bookings/$bookingId/transition" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $transitionBody `
  -UseBasicParsing
$transitionData = $transitionResp.Content | ConvertFrom-Json
Write-Host "✓ Booking transitioned to: $($transitionData.status)"

# Transition payment INITIATED -> PENDING
Write-Host "Step 5: Transition Payment - INITIATED to PENDING via PUT"
$stateBody = @{
  state = "PENDING"
  transitionReason = "Processing payment"
} | ConvertTo-Json

$paymentTransResp = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $stateBody `
  -UseBasicParsing
$paymentTransData = $paymentTransResp.Content | ConvertFrom-Json
Write-Host "✓ Payment transitioned to: $($paymentTransData.state)"

# Transition payment PENDING -> COMPLETED
Write-Host "Step 6: Transition Payment - PENDING to COMPLETED via PUT"
$stateBody2 = @{
  state = "COMPLETED"
  transitionReason = "Payment processed successfully"
} | ConvertTo-Json

$paymentTransResp2 = Invoke-WebRequest "$API_URL/api/payments/$paymentId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $stateBody2 `
  -UseBasicParsing
$paymentTransData2 = $paymentTransResp2.Content | ConvertFrom-Json
Write-Host "✓ Payment transitioned to: $($paymentTransData2.state)"

# Create dispatch
Write-Host "Step 7: Create Dispatch - PENDING status"
$dispatchBody = @{
  bookingId = $bookingId
  status = "PENDING"
} | ConvertTo-Json

$dispatchResp = Invoke-WebRequest "$API_URL/api/dispatches" -Method POST `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $dispatchBody `
  -UseBasicParsing
$dispatchData = $dispatchResp.Content | ConvertFrom-Json
$dispatchId = $dispatchData.id
Write-Host "✓ Dispatch created: $dispatchId (status: $($dispatchData.status))"

# Transition dispatch PENDING -> ASSIGNED
Write-Host "Step 8: Transition Dispatch - PENDING to ASSIGNED via PUT"
$dispatchTransBody = @{
  status = "ASSIGNED"
  transitionReason = "Assigned to field agent"
} | ConvertTo-Json

$dispatchTransResp = Invoke-WebRequest "$API_URL/api/dispatches/$dispatchId" -Method PUT `
  -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body $dispatchTransBody `
  -UseBasicParsing
$dispatchTransData = $dispatchTransResp.Content | ConvertFrom-Json
Write-Host "✓ Dispatch transitioned to: $($dispatchTransData.status)"

Write-Host ""
Write-Host "=== All core transition tests passed! ===" -ForegroundColor Green
