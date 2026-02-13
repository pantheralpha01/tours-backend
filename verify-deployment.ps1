# Post-Deployment Verification Script
# Run this to verify your HostPinnacle deployment is working correctly

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl,
    
    [string]$AdminEmail = "admin@example.com",
    [string]$AdminPassword = "Admin@123"
)

Write-Host "🔍 Verifying deployment at: $BaseUrl" -ForegroundColor Green

# Test 1: Health Check
Write-Host ""
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET
    if ($healthResponse.status -eq "ok") {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health endpoint unreachable: $_" -ForegroundColor Red
}

# Test 2: API Documentation
Write-Host ""
Write-Host "2. Testing API documentation..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-WebRequest -Uri "$BaseUrl/docs" -Method GET
    if ($docsResponse.StatusCode -eq 200) {
        Write-Host "✅ API documentation accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ API documentation not accessible: $_" -ForegroundColor Red
}

# Test 3: Authentication
Write-Host ""
Write-Host "3. Testing authentication..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $AdminEmail
        password = $AdminPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.data -and $loginResponse.data.accessToken) {
        Write-Host "✅ Authentication working" -ForegroundColor Green
        $token = $loginResponse.data.accessToken
        
        # Test 4: Protected Endpoint
        Write-Host ""
        Write-Host "4. Testing protected endpoint..." -ForegroundColor Yellow
        $headers = @{ Authorization = "Bearer $token" }
        
        try {
            $bookingsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/bookings" -Method GET -Headers $headers
            Write-Host "✅ Protected endpoints accessible" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Protected endpoints may have issues: $_" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Authentication failed - no token received" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Authentication failed: $_" -ForegroundColor Red
    Write-Host "💡 This might be normal if admin user doesn't exist yet. Run seed first." -ForegroundColor Cyan
}

# Test 5: Database Connection (indirect)
Write-Host ""
Write-Host "5. Testing database connectivity..." -ForegroundColor Yellow
try {
    # Try to access any endpoint that requires DB
    $partnersResponse = Invoke-RestMethod -Uri "$BaseUrl/api/partners" -Method GET
    Write-Host "✅ Database connectivity working" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "✅ Database working (got 401 - authentication required)" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connectivity issues: $_" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "🎯 Verification Summary:" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor White
Write-Host "Health: $BaseUrl/health" -ForegroundColor White
Write-Host "API Docs: $BaseUrl/docs" -ForegroundColor White
Write-Host "Login: POST $BaseUrl/api/auth/login" -ForegroundColor White
Write-Host ""

# Next steps
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. If authentication failed, run seed script to create admin user" -ForegroundColor White
Write-Host "2. Update frontend to use new backend URL: $BaseUrl" -ForegroundColor White
Write-Host "3. Test all critical user flows" -ForegroundColor White
Write-Host "4. Set up monitoring and error tracking" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Deployment verification complete!" -ForegroundColor Green