$API_URL = "http://localhost:4000"

# Login
$loginBody = @{email="admin@example.com"; password="Admin@123"} | ConvertTo-Json
$loginResp = Invoke-WebRequest "$API_URL/api/auth/login" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody `
  -UseBasicParsing
$token = ($loginResp.Content | ConvertFrom-Json).accessToken
Write-Host "Logged in. Token: $($token.Substring(0,20))..."

# Create booking
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
$bookingId = ($bookingResp.Content | ConvertFrom-Json).id
Write-Host "Booking created: $bookingId"

# Transition booking
Write-Host "Attempting PUT to /api/bookings/$bookingId/transition"
$transitionBody = @{toStatus="CONFIRMED"; transitionReason="Test"} | ConvertTo-Json

try {
  $url = "$API_URL/api/bookings/$bookingId/transition"
  Write-Host "URL: $url"
  Write-Host "Method: PUT"
  Write-Host "Body: $transitionBody"
  
  $result = Invoke-WebRequest $url -Method PUT `
    -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} `
    -Body $transitionBody `
    -UseBasicParsing
    
  Write-Host "Response Status: $($result.StatusCode)"
  Write-Host "Response: $($result.Content)"
} catch {
  Write-Host "ERROR: $($_.Exception.GetType().Name)"
  Write-Host "Message: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    Write-Host "status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $response = $reader.ReadToEnd()
    Write-Host "Response body: $response"
  }
}
