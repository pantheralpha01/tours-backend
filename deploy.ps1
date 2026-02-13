# HostPinnacle Deployment Script (PowerShell)
# Run this script to prepare your backend for deployment

param(
    [switch]$SkipBuild,
    [switch]$SkipZip
)

Write-Host "📦 Preparing backend for HostPinnacle deployment..." -ForegroundColor Green

# Check if required files exist
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this script from the backend directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📋 Installing dependencies..." -ForegroundColor Yellow
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Run linting
Write-Host "🔍 Running code quality checks..." -ForegroundColor Yellow
try {
    npm run lint
    Write-Host "✅ Linting passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Linting skipped (not configured or failed)" -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "🗃️  Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Build TypeScript
if (!$SkipBuild) {
    Write-Host "🏗️  Building TypeScript..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build successful" -ForegroundColor Green
}

# Test database connection (optional)
if ($env:DATABASE_URL) {
    Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
    try {
        "SELECT 1;" | npx prisma db execute --stdin
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Database connection test skipped or failed" -ForegroundColor Yellow
    }
}

# Create deployment package
if (!$SkipZip) {
    Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $zipName = "tours-backend-$timestamp.zip"
    
    # Create a temporary list of files to include
    $filesToInclude = @(
        "dist/*",
        "prisma/*", 
        "package.json",
        "package-lock.json"
    )
    
    # Add optional files if they exist
    if (Test-Path ".env.production") { $filesToInclude += ".env.production" }
    
    try {
        # Use 7-Zip if available, otherwise use PowerShell compression
        if (Get-Command "7z" -ErrorAction SilentlyContinue) {
            7z a $zipName $filesToInclude -xr!*.log -xr!*.md -xr!.git -xr!src -xr!node_modules
        } else {
            # PowerShell built-in compression (Windows 10+)
            Compress-Archive -Path $filesToInclude -DestinationPath $zipName -Force
        }
        Write-Host "✅ Created deployment package: $zipName" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not create ZIP package. Please create manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload files to HostPinnacle (via ZIP or Git)" -ForegroundColor White  
Write-Host "2. Set up environment variables in HostPinnacle control panel" -ForegroundColor White
Write-Host "3. Configure PostgreSQL database" -ForegroundColor White
Write-Host "4. Run database migrations" -ForegroundColor White
Write-Host "5. Start the application" -ForegroundColor White
Write-Host ""
Write-Host "📚 See HOSTPINNACLE_DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan

# Display environment variables reminder
Write-Host ""
Write-Host "🔑 Required Environment Variables:" -ForegroundColor Yellow
Write-Host "DATABASE_URL, NODE_ENV, JWT_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ALLOWED_ORIGINS" -ForegroundColor White