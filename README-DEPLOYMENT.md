# 🚀 Tours Backend - Complete Deployment Guide

This guide provides step-by-step instructions to deploy the Tours Backend to production.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Deployment Options](#deployment-options)
4. [Environment Setup](#environment-setup)
5. [GitHub Actions Deployment](#github-actions-deployment)
6. [Manual Deployment](#manual-deployment)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [ ] **GitHub repository** with the code
- [ ] **PostgreSQL database** set up and accessible
- [ ] **Hosting provider account** (e.g., HostPinnacle, AWS, DigitalOcean, Heroku)
- [ ] **Domain name** configured (optional but recommended)
- [ ] **FTP/SSH credentials** for your hosting provider
- [ ] **Node.js 20.x** installed on your server
- [ ] **Environment variables** prepared (see [.env.example](.env.example))

## Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Configure GitHub Secrets** (Settings → Secrets and variables → Actions):
   ```
   FTP_SERVER=your-server.com
   FTP_USERNAME=your-username
   FTP_PASSWORD=your-password
   FTP_SERVER_DIR=/public_html/api/
   ```

2. **Push to main branch** or manually trigger the workflow:
   - Go to Actions tab → "Simple Deploy" → "Run workflow"

3. **Done!** Your app will be automatically deployed.

### Option 2: Manual Deployment

See [Manual Deployment](#manual-deployment) section below.

## Deployment Options

### 🎯 Option A: GitHub Actions (Recommended)

**Best for:** Teams wanting automated CI/CD

- ✅ Automated deployment on every push to `main`
- ✅ Built-in testing and linting
- ✅ Easy rollback capabilities
- ✅ No manual intervention needed

**Workflows available:**
- `simple-deploy.yml` - Basic FTP deployment (recommended for most users)
- `deploy.yml` - Advanced with staging/production environments

### 🛠️ Option B: Manual Deployment

**Best for:** One-time deployments or custom hosting setups

- Manual FTP upload
- SSH deployment
- Docker container deployment

## Environment Setup

### 1. Create Environment File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

#### Essential Variables (Required)

```env
# Database - Get from your hosting provider's database panel
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# Server Configuration
PORT=4000
NODE_ENV=production

# Security - Generate strong secrets (use: openssl rand -base64 32)
JWT_SECRET="generate-a-strong-random-secret"
ACCESS_TOKEN_SECRET="generate-another-strong-random-secret"
REFRESH_TOKEN_SECRET="generate-yet-another-strong-random-secret"

# CORS - Add your frontend URLs
ALLOWED_ORIGINS="https://yourdomain.com,https://app.yourdomain.com"
```

#### Optional Variables (Based on Features Used)

```env
# Twilio (for SMS/WhatsApp notifications)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+1234567890"

# Payment Gateways (if using payments)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
MPESA_CONSUMER_KEY="your-mpesa-key"
MPESA_CONSUMER_SECRET="your-mpesa-secret"
```

### 3. Generate Secure Secrets

Use these commands to generate strong secrets:

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## GitHub Actions Deployment

### Step 1: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | Your FTP server address | `ftp.yourdomain.com` |
| `FTP_USERNAME` | Your FTP username | `user@yourdomain.com` |
| `FTP_PASSWORD` | Your FTP password | `your-secure-password` |
| `FTP_SERVER_DIR` | Deployment directory path | `/public_html/api/` |

### Step 2: Set Environment Variables on Server

Configure environment variables in your hosting control panel (cPanel, Plesk, etc.):

1. Find "Environment Variables" or "Node.js" section
2. Add all variables from your `.env` file
3. Save and restart the application

### Step 3: Deploy

**Automatic Deployment:**
- Push to `main` branch
- GitHub Actions will automatically build and deploy

**Manual Trigger:**
1. Go to **Actions** tab
2. Select **Simple Deploy** workflow
3. Click **Run workflow**
4. Choose `main` branch
5. Click **Run workflow**

### Step 4: Monitor Deployment

1. Watch the workflow progress in the Actions tab
2. Check for any errors in the logs
3. Verify deployment at your domain

## Manual Deployment

### Option 1: FTP Deployment

1. **Build the application locally:**
   ```bash
   npm ci
   npm run build
   ```

2. **Upload files via FTP:**
   - Connect to your FTP server
   - Upload these files/folders:
     - `dist/` (built application)
     - `node_modules/` (or install on server)
     - `prisma/` (database schema)
     - `package.json`
     - `package-lock.json`

3. **Install dependencies on server:**
   ```bash
   ssh user@yourserver.com
   cd /path/to/your/app
   npm ci --production
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start the application:**
   ```bash
   npm start
   # Or with PM2:
   pm2 start dist/server.js --name tours-backend
   ```

### Option 2: SSH Deployment

Use the provided deployment scripts:

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**On Windows:**
```powershell
.\deploy.ps1
```

### Option 3: Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t tours-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name tours-backend \
     -p 4000:4000 \
     --env-file .env \
     tours-backend
   ```

Or use Docker Compose:

```bash
docker-compose up -d
```

## Post-Deployment

### 1. Verify Deployment

Run the verification script:

```bash
# On Windows
.\verify-deployment.ps1

# On Linux/Mac
chmod +x verify-deployment.sh
./verify-deployment.sh
```

Or manually test endpoints:

```bash
# Health check
curl https://api.yourdomain.com/health

# API documentation
curl https://api.yourdomain.com/api-docs

# Login endpoint
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Set Up Process Manager (PM2)

For production, use PM2 to keep your app running:

```bash
# Install PM2 globally
npm install -g pm2

# Start your app
pm2 start dist/server.js --name tours-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 3. Configure Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Enable HTTPS/SSL

Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### 5. Set Up Monitoring

**Option A: PM2 Plus (Free tier available)**
```bash
pm2 link <secret-key> <public-key>
pm2 install pm2-logrotate
```

**Option B: External monitoring**
- UptimeRobot (free uptime monitoring)
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (APM)

### 6. Database Backups

Set up automatic database backups:

```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: FTP Connection Failed

**Symptoms:** GitHub Actions workflow fails at deployment step

**Solutions:**
- Verify FTP credentials in GitHub Secrets
- Check if FTP is enabled in your hosting control panel
- Try using port 21 (standard FTP) or port 22 (SFTP)
- Check firewall rules on your server

#### Issue 2: Database Connection Error

**Symptoms:** Application starts but can't connect to database

**Solutions:**
```bash
# Check DATABASE_URL format
# Correct format: postgresql://username:password@host:port/database

# Verify database exists
psql -h host -U username -d database -c "SELECT 1;"

# Check database user permissions
# User needs CREATE, SELECT, INSERT, UPDATE, DELETE permissions

# Whitelist your server's IP address in database firewall
```

#### Issue 3: Port Already in Use

**Symptoms:** Error: `EADDRINUSE: address already in use :::4000`

**Solutions:**
```bash
# Find process using the port
lsof -i :4000
# Or on Windows:
netstat -ano | findstr :4000

# Kill the process
kill -9 <PID>
# Or on Windows:
taskkill /PID <PID> /F

# Or change PORT in environment variables
```

#### Issue 4: Build Fails

**Symptoms:** `npm run build` fails

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Generate Prisma client
npx prisma generate
```

#### Issue 5: Prisma Migration Fails

**Symptoms:** `prisma migrate deploy` fails

**Solutions:**
```bash
# Reset the database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset

# Or apply migrations manually
npx prisma migrate resolve --applied <migration-name>

# Verify schema is in sync
npx prisma migrate status
```

#### Issue 6: CORS Errors

**Symptoms:** Frontend can't connect, CORS policy errors in browser

**Solutions:**
- Check `ALLOWED_ORIGINS` includes your frontend URL
- Ensure protocol (http/https) matches
- Include port if non-standard (e.g., `http://localhost:3000`)
- Multiple origins: `https://app.com,https://admin.app.com`

#### Issue 7: 502 Bad Gateway (Nginx)

**Symptoms:** Nginx shows 502 error

**Solutions:**
```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs tours-backend

# Restart the app
pm2 restart tours-backend

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Issue 8: GitHub Actions Workflow Times Out

**Symptoms:** Workflow runs for 1+ hour and times out

**Solutions:**
- Check network connectivity to FTP server
- Reduce files being uploaded (use `.dockerignore` properly)
- Consider using SFTP instead of FTP
- Split large deployments into multiple steps

### Getting Help

1. **Check GitHub Actions logs** for detailed error messages
2. **Review server logs:**
   ```bash
   pm2 logs tours-backend
   # Or
   tail -f /var/log/nginx/error.log
   ```
3. **Check application health:**
   ```bash
   curl http://localhost:4000/health
   ```
4. **Review this documentation** for configuration issues

## Additional Resources

- [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) - GitHub Actions setup details
- [HOSTPINNACLE_DEPLOYMENT.md](HOSTPINNACLE_DEPLOYMENT.md) - HostPinnacle specific guide
- [.env.example](.env.example) - Environment variables template
- [docker-compose.yml](docker-compose.yml) - Docker deployment configuration

## Security Checklist

Before going to production:

- [ ] All secrets are in environment variables (not in code)
- [ ] Strong random secrets generated for JWT tokens
- [ ] DATABASE_URL does not contain default/weak passwords
- [ ] HTTPS/SSL enabled on production domain
- [ ] CORS configured to only allow trusted domains
- [ ] Rate limiting enabled (check `src/middleware`)
- [ ] Helmet.js security headers configured
- [ ] Database backups automated
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Uptime monitoring configured
- [ ] `.env` file is in `.gitignore`
- [ ] GitHub Secrets are properly configured

## Next Steps

1. ✅ Set up monitoring and alerts
2. ✅ Configure database backups
3. ✅ Set up staging environment for testing
4. ✅ Implement CI/CD best practices
5. ✅ Document API for frontend team
6. ✅ Set up logging aggregation
7. ✅ Configure CDN if needed
8. ✅ Optimize database queries
9. ✅ Load testing before launch
10. ✅ Create runbooks for common issues

---

**Need Help?** Check the troubleshooting section above or review the GitHub Actions logs for detailed error messages.
