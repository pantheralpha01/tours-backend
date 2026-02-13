#!/usr/bin/env powershell

# Simple debug test for transitions
$BaseUrl = "http://localhost:4000"

Write-Host "🔍 Testing API endpoints..."

# Test 1: Health check (no auth required)
Write-Host "`n1️⃣ Testing health endpoint..."
try {
  $response = Invoke-WebRequest "$BaseUrl/api/health" -Method GET -ErrorAction SilentlyContinue
  Write-Host "✓ Health endpoint responded: $($response.StatusCode)"
} catch {
  Write-Host "✗ Health endpoint not available"
}

# Test 2: Get routes
Write-Host "`n2️⃣ Getting available routes..."
$routeResponse = Invoke-WebRequest "$BaseUrl/api" -Method GET -ErrorAction SilentlyContinue
Write-Host "API root response: $($routeResponse.StatusCode)"

# Test 3: Login
Write-Host "`n3️⃣ Testing login..."
$loginBody = @{
  email = "admin@example.com"
  password = "Admin@123"
} | ConvertTo-Json

try {
  $loginResponse = Invoke-WebRequest "$BaseUrl/api/auth/login" -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $loginBody `
    -ErrorAction Stop
  
  $loginData = $loginResponse.Content | ConvertFrom-Json
  Write-Host "✓ Login successful"
  Write-Host "User ID: $($loginData.user.id)"
  $token = $loginData.accessToken
  
  # Test 4: Create booking with token
  Write-Host "`n4️⃣ Testing booking creation..."
  $bookingBody = @{
    customerName = "Test Customer"
    serviceTitle = "Test Tour"
    amount = 100
    currency = "USD"
    status = "DRAFT"
  } | ConvertTo-Json
  
  try {
    $bookingResponse = Invoke-WebRequest "$BaseUrl/api/bookings" -Method POST `
      -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
      } `
      -Body $bookingBody `
      -ErrorAction Stop
    
    Write-Host "✓ Booking created: $($bookingResponse.StatusCode)"
    $bookingData = $bookingResponse.Content | ConvertFrom-Json
    Write-Host "Booking ID: $($bookingData.id)"
    Write-Host "Booking Status: $($bookingData.status)"
    
  } catch {
    Write-Host "✗ Booking creation failed: $($_.Exception.Response.StatusCode)"
    Write-Host $_.Exception.Response.StatusCode
    Write-Host $_.ErrorDetails.Message
  }
  
} catch {
  Write-Host "✗ Login failed: $($_.Exception.Response.StatusCode)"
  Write-Host $_.ErrorDetails.Message
}
