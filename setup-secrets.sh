#!/bin/bash
# GitHub Secrets Setup Helper Script
# This script helps you prepare the values needed for GitHub Secrets

echo "🔐 GitHub Secrets Setup Helper"
echo "================================"
echo ""
echo "Copy these values to GitHub Settings > Secrets and variables > Actions"
echo ""

echo "📋 REQUIRED SECRETS FOR SIMPLE DEPLOY:"
echo "------------------------------------"
echo "FTP_SERVER = timelessfactors.co.ke"
echo "FTP_USERNAME = timeles1" 
echo "FTP_PASSWORD = Timeless@2025"
echo "FTP_SERVER_DIR = /home2/timeles1/tours-backend/"
echo ""

echo "📋 ENVIRONMENT VARIABLES FOR HOSTING PANEL:"
echo "-------------------------------------------"
echo "DATABASE_URL = postgresql://username:password@host:port/database_name"
echo "PORT = 4000"
echo "NODE_ENV = production"
echo "JWT_SECRET = $(openssl rand -base64 32 2>/dev/null || echo 'GENERATE_SECURE_SECRET_HERE')"
echo "ACCESS_TOKEN_SECRET = $(openssl rand -base64 32 2>/dev/null || echo 'GENERATE_SECURE_SECRET_HERE')"  
echo "REFRESH_TOKEN_SECRET = $(openssl rand -base64 32 2>/dev/null || echo 'GENERATE_SECURE_SECRET_HERE')"
echo "ALLOWED_ORIGINS = https://yoursite.com,https://app.yoursite.com"
echo ""

echo "📋 OPTIONAL PAYMENT VARIABLES:"
echo "------------------------------"
echo "PAYPAL_CLIENT_ID = [Your PayPal Client ID]"
echo "PAYPAL_CLIENT_SECRET = [Your PayPal Client Secret]"
echo "MPESA_CONSUMER_KEY = [Your M-Pesa Consumer Key]"
echo "MPESA_CONSUMER_SECRET = [Your M-Pesa Consumer Secret]"
echo ""

echo "🔍 NEXT STEPS:"
echo "--------------"
echo "1. Go to your GitHub repository"
echo "2. Settings > Secrets and variables > Actions"
echo "3. Click 'New repository secret'"
echo "4. Add each secret from the list above"
echo "5. Set environment variables in your hosting control panel"
echo "6. Push to main branch to trigger deployment"
echo ""

echo "💡 TIP: Keep a secure copy of these values for backup!"
echo "⚠️  WARNING: Never commit these secrets to Git!"