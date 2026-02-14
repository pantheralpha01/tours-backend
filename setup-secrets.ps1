# GitHub Secrets Setup Helper Script (PowerShell)
# This script helps you prepare the values needed for GitHub Secrets

Write-Host "🔐 GitHub Secrets Setup Helper" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Copy these values to GitHub Settings > Secrets and variables > Actions" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 REQUIRED SECRETS FOR SIMPLE DEPLOY:" -ForegroundColor Cyan
Write-Host "------------------------------------" -ForegroundColor Cyan
Write-Host "FTP_SERVER = timelessfactors.co.ke" -ForegroundColor White
Write-Host "FTP_USERNAME = [Your FTP username - see deployment docs]" -ForegroundColor White
Write-Host "FTP_PASSWORD = [Your FTP password - see deployment docs]" -ForegroundColor White
Write-Host "FTP_SERVER_DIR = /home2/timeles1/tours-backend/" -ForegroundColor White
Write-Host ""

Write-Host "📋 ENVIRONMENT VARIABLES FOR HOSTING PANEL:" -ForegroundColor Cyan
Write-Host "-------------------------------------------" -ForegroundColor Cyan
Write-Host "DATABASE_URL = postgresql://username:password@host:port/database_name" -ForegroundColor White
Write-Host "PORT = 4000" -ForegroundColor White
Write-Host "NODE_ENV = production" -ForegroundColor White

# Generate secure secrets
$jwtSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$accessSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$refreshSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

Write-Host "JWT_SECRET = $jwtSecret" -ForegroundColor White
Write-Host "ACCESS_TOKEN_SECRET = $accessSecret" -ForegroundColor White
Write-Host "REFRESH_TOKEN_SECRET = $refreshSecret" -ForegroundColor White
Write-Host "ALLOWED_ORIGINS = https://yoursite.com,https://app.yoursite.com" -ForegroundColor White
Write-Host ""

Write-Host "📋 OPTIONAL PAYMENT VARIABLES:" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
Write-Host "PAYPAL_CLIENT_ID = [Your PayPal Client ID]" -ForegroundColor White
Write-Host "PAYPAL_CLIENT_SECRET = [Your PayPal Client Secret]" -ForegroundColor White
Write-Host "MPESA_CONSUMER_KEY = [Your M-Pesa Consumer Key]" -ForegroundColor White
Write-Host "MPESA_CONSUMER_SECRET = [Your M-Pesa Consumer Secret]" -ForegroundColor White
Write-Host ""

Write-Host "🔍 NEXT STEPS:" -ForegroundColor Magenta
Write-Host "--------------" -ForegroundColor Magenta
Write-Host "1. Go to your GitHub repository" -ForegroundColor White
Write-Host "2. Settings > Secrets and variables > Actions" -ForegroundColor White
Write-Host "3. Click 'New repository secret'" -ForegroundColor White
Write-Host "4. Add each secret from the list above" -ForegroundColor White
Write-Host "5. Set environment variables in your hosting control panel" -ForegroundColor White
Write-Host "6. Push to main branch to trigger deployment" -ForegroundColor White
Write-Host ""

Write-Host "💡 TIP: Keep a secure copy of these values for backup!" -ForegroundColor Yellow
Write-Host "⚠️  WARNING: Never commit these secrets to Git!" -ForegroundColor Red

# Optionally save to a secure file
$saveToFile = Read-Host "Save secrets to secure file? (y/N)"
if ($saveToFile -eq 'y' -or $saveToFile -eq 'Y') {
    $secretsFile = "secrets-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    @"
GitHub Secrets for Tours Backend
================================
Generated: $(Get-Date)

FTP_SERVER = timelessfactors.co.ke
FTP_USERNAME = [Your FTP username - see deployment docs]
FTP_PASSWORD = [Your FTP password - see deployment docs]
FTP_SERVER_DIR = /home2/timeles1/tours-backend/

Environment Variables:
DATABASE_URL = postgresql://username:password@host:port/database_name
PORT = 4000
NODE_ENV = production
JWT_SECRET = $jwtSecret
ACCESS_TOKEN_SECRET = $accessSecret
REFRESH_TOKEN_SECRET = $refreshSecret
ALLOWED_ORIGINS = https://yoursite.com,https://app.yoursite.com

WARNING: Keep this file secure and delete after use!
"@ | Out-File -FilePath $secretsFile -Encoding UTF8
    
    Write-Host "✅ Secrets saved to: $secretsFile" -ForegroundColor Green
    Write-Host "⚠️  Remember to delete this file after setting up GitHub Secrets!" -ForegroundColor Yellow
}