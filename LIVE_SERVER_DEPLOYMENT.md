# 🚀 Live Server Deployment Configuration

This document contains the configuration for deploying to the **live production server** at `timelessfactors.co.ke`.

## 🔐 SECURITY NOTICE

**IMPORTANT:** The actual FTP username and password should NEVER be committed to version control. Obtain these credentials from your hosting provider or secure password manager, and add them only to GitHub Secrets.

## 📋 Live Server Details

### FTP Configuration
- **Server:** `timelessfactors.co.ke`
- **Username:** [Obtain from hosting provider]
- **Password:** [Obtain from hosting provider]
- **Deployment Directory:** `/home2/timeles1/tours-backend/`

## 🔧 Setup Instructions

### Step 1: Configure GitHub Secrets

To enable automated deployment via GitHub Actions, add the following secrets to your GitHub repository:

1. Go to: `https://github.com/pantheralpha01/tours-backend`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these:

| Secret Name | Value |
|-------------|-------|
| `FTP_SERVER` | `timelessfactors.co.ke` |
| `FTP_USERNAME` | [Obtain from hosting provider] |
| `FTP_PASSWORD` | [Obtain from hosting provider] |
| `FTP_SERVER_DIR` | `/home2/timeles1/tours-backend/` |

### Step 2: Set Environment Variables on Server

Configure these environment variables on the live server (via cPanel or hosting control panel):

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/tours_production

# Server Configuration
PORT=4000
NODE_ENV=production

# JWT & Authentication Secrets (Generate strong random secrets!)
JWT_SECRET=your-generated-secret-here
ACCESS_TOKEN_SECRET=your-generated-secret-here
REFRESH_TOKEN_SECRET=your-generated-secret-here

# CORS Configuration (Update with your actual frontend domain)
ALLOWED_ORIGINS=https://timelessfactors.co.ke,https://www.timelessfactors.co.ke

# Optional: Payment Gateway Integration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
```

**To generate secure secrets:**
```bash
# Run this command 3 times to generate 3 different secrets
openssl rand -base64 32
```

### Step 3: Create PostgreSQL Database

1. Login to your hosting control panel (cPanel)
2. Go to **Databases** → **PostgreSQL Databases**
3. Create a new database: `tours_production`
4. Create a database user with a strong password
5. Assign the user to the database with **ALL PRIVILEGES**
6. Note the connection details for `DATABASE_URL`

### Step 4: Deploy to Live Server

#### Option A: Automatic Deployment (Recommended)

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy to live server"
git push origin main
```

The GitHub Actions workflow will:
1. Build the application
2. Run tests
3. Generate Prisma client
4. Deploy to live server via FTP
5. Notify deployment status

#### Option B: Manual Trigger

1. Go to the **Actions** tab in GitHub
2. Select **Simple Deploy** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow** button

### Step 5: Monitor Deployment

1. Go to **Actions** tab in GitHub repository
2. Click on the running workflow to see live progress
3. Each step will show success ✅ or failure ❌
4. Check the logs if any issues occur

### Step 6: Post-Deployment Setup

After first successful deployment, SSH into your server and run:

```bash
# Navigate to deployment directory
cd /home2/timeles1/tours-backend

# Install dependencies (if not already done)
npm ci --production

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start the application with PM2
pm2 start dist/server.js --name tours-backend-live

# Save PM2 process list
pm2 save

# Configure PM2 to start on server reboot
pm2 startup
```

### Step 7: Configure Web Server (Node.js App)

In cPanel or hosting control panel:

1. Go to **Software** → **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version:** 20.x
   - **Application mode:** Production
   - **Application root:** `/home2/timeles1/tours-backend`
   - **Application URL:** Your domain (e.g., `api.timelessfactors.co.ke`)
   - **Application startup file:** `dist/server.js`
   - **Environment variables:** Add all variables from Step 2
4. Click **Create** and then **Restart**

### Step 8: Configure SSL/HTTPS

Enable HTTPS for secure connections:

1. Go to **Security** → **SSL/TLS Status** in cPanel
2. Find your domain (`api.timelessfactors.co.ke`)
3. Click **Run AutoSSL** to get a free Let's Encrypt certificate
4. Wait for certificate to be issued (usually 1-2 minutes)

### Step 9: Verify Deployment

Test your deployed API:

```bash
# Test health endpoint
curl https://api.timelessfactors.co.ke/health

# Test API documentation
curl https://api.timelessfactors.co.ke/api-docs

# Test authentication endpoint
curl -X POST https://api.timelessfactors.co.ke/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test tours endpoint
curl https://api.timelessfactors.co.ke/api/tours
```

Or run the verification script:
```bash
./verify-deployment.sh https://api.timelessfactors.co.ke
```

## 🔍 Troubleshooting

### Deployment Failed?

**Check GitHub Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow
3. Review error messages in each step

**Common issues:**

1. **FTP Connection Error**
   - Verify FTP credentials are correct in GitHub Secrets
   - Check if server allows FTP connections
   - Try connecting manually with FTP client (FileZilla)

2. **Directory Not Found**
   - Ensure `/home2/timeles1/tours-backend/` exists on server
   - Create directory if needed via cPanel File Manager or SSH

3. **Permission Denied**
   - Check directory permissions (should be 755)
   - Verify FTP user has write access

### Application Not Starting?

1. **Check environment variables** are set correctly on server
2. **Verify DATABASE_URL** is correct and database is accessible
3. **Check application logs** in cPanel or via SSH:
   ```bash
   pm2 logs tours-backend-live
   ```
4. **Verify Node.js version** is 20.x
5. **Run migrations manually** if not done:
   ```bash
   cd /home2/timeles1/tours-backend
   npx prisma migrate deploy
   ```

### Database Connection Issues?

1. Verify PostgreSQL is running
2. Check database credentials in `DATABASE_URL`
3. Ensure database user has proper permissions
4. Test connection:
   ```bash
   psql "postgresql://username:password@host:5432/tours_production"
   ```

## 📊 Monitoring

Set up monitoring for your live application:

1. **Application Logs:** `pm2 logs tours-backend-live`
2. **Process Status:** `pm2 status`
3. **Restart App:** `pm2 restart tours-backend-live`
4. **View Metrics:** `pm2 monit`

## 🔄 Updating Deployment

To deploy updates:

1. Make changes to your code
2. Commit and push to `main` branch
3. GitHub Actions will automatically deploy
4. Monitor the deployment in Actions tab

## 🔒 Security Checklist

- ✅ Strong passwords for FTP and database
- ✅ GitHub Secrets configured (never in code)
- ✅ Environment variables set on server
- ✅ HTTPS/SSL enabled
- ✅ CORS properly configured
- ✅ Database backups enabled
- ✅ Regular security updates

## 📞 Support

For issues or questions:
- Check [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) for detailed setup
- Review [README-DEPLOYMENT.md](README-DEPLOYMENT.md) for comprehensive guide
- Check GitHub Actions logs for deployment errors

---

**Server:** timelessfactors.co.ke  
**Deployment Path:** /home2/timeles1/tours-backend/  
**Last Updated:** 2026-02-14
