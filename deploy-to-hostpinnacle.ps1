Write-Host "Starting Docker Deployment Process..." -ForegroundColor Cyan

$IMAGE_NAME = "tours-backend"
$IMAGE_TAG = "latest"
$EXPORT_FILE = "tours-backend.tar"

Write-Host "`nStep 1: Building Docker image..." -ForegroundColor Yellow
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Docker image built successfully!" -ForegroundColor Green

Write-Host "`nStep 2: Exporting Docker image to tar file..." -ForegroundColor Yellow
docker save -o $EXPORT_FILE ${IMAGE_NAME}:${IMAGE_TAG}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker export failed!" -ForegroundColor Red
    exit 1
}

$fileSize = (Get-Item $EXPORT_FILE).Length / 1MB
Write-Host "Docker image exported successfully!" -ForegroundColor Green
Write-Host "File: $EXPORT_FILE (Size: $([math]::Round($fileSize, 2)) MB)" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT PACKAGE READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Upload these files to HostPinnacle:" -ForegroundColor White
Write-Host "   - $EXPORT_FILE" -ForegroundColor Cyan
Write-Host "   - .env.production" -ForegroundColor Cyan
Write-Host "   - deploy-on-server.sh" -ForegroundColor Cyan
Write-Host "`n2. SSH into your server and run: bash deploy-on-server.sh" -ForegroundColor White
Write-Host "`n3. Access your API at: https://timelessfactors.co.ke:4000" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan