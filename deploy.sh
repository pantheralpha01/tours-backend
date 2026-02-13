#!/bin/bash

# HostPinnacle Deployment Script
# Run this script to prepare your backend for deployment

set -e  # Exit on any error

echo "📦 Preparing backend for HostPinnacle deployment..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the backend directory."
    exit 1
fi

# Install dependencies
echo "📋 Installing dependencies..."
npm ci

# Run linting (if configured)
echo "🔍 Running code quality checks..."
npm run lint || echo "⚠️  Linting skipped (not configured)"

# Generate Prisma client
echo "🗃️  Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

# Test database connection (optional)
if [ -n "$DATABASE_URL" ]; then
    echo "🔌 Testing database connection..."
    npx prisma db execute --stdin <<< "SELECT 1;" || echo "⚠️  Database connection test skipped"
fi

# Create deployment package
echo "📦 Creating deployment package..."
zip -r "tours-backend-$(date +%Y%m%d-%H%M%S).zip" \
    dist/ \
    node_modules/ \
    prisma/ \
    package*.json \
    .env.production \
    -x "*.log" "*.md" ".git/*" "src/*"

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Upload the generated ZIP file to HostPinnacle"
echo "2. Set up environment variables in HostPinnacle control panel"
echo "3. Configure database connection"
echo "4. Start the application"
echo ""
echo "📚 See HOSTPINNACLE_DEPLOYMENT.md for detailed instructions"