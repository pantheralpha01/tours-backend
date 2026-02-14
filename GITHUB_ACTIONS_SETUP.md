# 🔧 GitHub Actions Setup Checklist

Follow this step-by-step guide to configure automated deployment via GitHub Actions.

## Prerequisites

Before you begin, make sure you have:

- [ ] GitHub repository with code pushed
- [ ] Hosting provider account (e.g., HostPinnacle, cPanel, etc.)
- [ ] FTP credentials from your hosting provider
- [ ] PostgreSQL database created
- [ ] Domain/subdomain configured (optional)

## Step 1: Gather FTP Credentials

Get your FTP credentials from your hosting control panel:

### HostPinnacle / cPanel:
1. Login to cPanel
2. Go to **Files** → **FTP Accounts**
3. Note down:
   - FTP Server: Usually `ftp.yourdomain.com` or your server IP
   - Username: Your FTP account username
   - Password: Your FTP account password
   - Directory: Usually `/public_html/` or `/public_html/api/`

### Other Hosting Providers:
Check your hosting provider's documentation for FTP details.

## Step 2: Configure GitHub Secrets

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/pantheralpha01/tours-backend`

2. **Open Settings**
   - Click the **Settings** tab at the top of the repository

3. **Navigate to Secrets**
   - In the left sidebar, click **Secrets and variables** → **Actions**

4. **Add Repository Secrets**
   - Click **New repository secret** button
   - Add each of the following secrets:

### Required Secrets:

| Secret Name | Example Value | Where to Find |
|-------------|---------------|---------------|
| `FTP_SERVER` | `timelessfactors.co.ke` | Live server hostname |
| `FTP_USERNAME` | `timeles1` | FTP account username |
| `FTP_PASSWORD` | `Timeless@2025` | FTP account password |
| `FTP_SERVER_DIR` | `/home2/timeles1/tours-backend/` | Deployment directory path |

**Important Notes:**
- `FTP_SERVER_DIR` should end with a trailing slash `/`
- Use the full FTP server address (e.g., `ftp.yourdomain.com` not just `yourdomain.com`)
- Keep your secrets secure - never commit them to code

## Step 3: Set Environment Variables on Server

Your hosting server needs environment variables configured:

### Via cPanel:
1. Login to cPanel
2. Go to **Software** → **Setup Node.js App** (or similar)
3. Select your application or create new Node.js app
4. Click **Environment Variables** tab
5. Add each variable from `.env.example`

### Required Environment Variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
PORT=4000
NODE_ENV=production
JWT_SECRET=generate-strong-random-secret
ACCESS_TOKEN_SECRET=generate-strong-random-secret
REFRESH_TOKEN_SECRET=generate-strong-random-secret
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

**Generate Secrets:**
```bash
# Use this command to generate strong secrets
openssl rand -base64 32
```

Run it 3 times to get 3 different secrets for JWT, ACCESS_TOKEN, and REFRESH_TOKEN.

## Step 4: Configure Database

1. **Create PostgreSQL Database:**
   - Go to your hosting control panel
   - Find **Databases** → **PostgreSQL Databases**
   - Create a new database (e.g., `tours_production`)
   - Create a database user
   - Assign user to the database with all privileges

2. **Get Database Connection String:**
   ```
   postgresql://username:password@host:5432/database_name
   ```
   
   - `username`: Your database user
   - `password`: Database user password
   - `host`: Database host (often `localhost` or specific host from panel)
   - `5432`: PostgreSQL port (usually 5432)
   - `database_name`: Your database name

3. **Add DATABASE_URL to server environment variables** (Step 3 above)

## Step 5: Test the Workflow

### Option A: Automatic Deployment (Push to main)

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "Test deployment"
git push origin main
```

### Option B: Manual Workflow Trigger

1. Go to **Actions** tab in GitHub
2. Select **Simple Deploy** workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

## Step 6: Monitor Deployment

1. **Watch the workflow:**
   - Go to **Actions** tab
   - Click on the running workflow
   - Watch each step complete
   - Check for any errors

2. **Common Errors and Solutions:**

   **Error: "Login authentication failed"**
   - ✓ Check `FTP_USERNAME` and `FTP_PASSWORD` are correct
   - ✓ Verify FTP is enabled in hosting panel
   - ✓ Check if IP whitelisting is required

   **Error: "Cannot find directory"**
   - ✓ Check `FTP_SERVER_DIR` path is correct
   - ✓ Ensure directory exists on server
   - ✓ Verify trailing slash in directory path

   **Error: "Connection timeout"**
   - ✓ Check `FTP_SERVER` address is correct
   - ✓ Verify firewall allows FTP connections
   - ✓ Try with server IP instead of domain

## Step 7: Verify Deployment

After successful deployment:

1. **Check your API endpoint:**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **Check Swagger documentation:**
   - Visit: `https://api.yourdomain.com/api-docs`

3. **Run verification script:**
   ```bash
   ./verify-deployment.sh https://api.yourdomain.com
   ```

4. **Test a few endpoints:**
   ```bash
   # Test login
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   
   # Test tours list
   curl https://api.yourdomain.com/api/tours
   ```

## Step 8: Post-Deployment Setup

### Set up PM2 (Process Manager)

SSH into your server:

```bash
# Install PM2 globally
npm install -g pm2

# Start your app
cd /path/to/your/app
pm2 start dist/server.js --name tours-backend

# Save process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Configure Application Startup

In cPanel or your hosting panel:
1. Go to **Setup Node.js App**
2. Set **Application startup file:** `dist/server.js`
3. Set **Application mode:** `Production`
4. Click **Restart** to apply changes

## Step 9: Set Up HTTPS/SSL

### Via cPanel (Let's Encrypt):
1. Go to **Security** → **SSL/TLS Status**
2. Find your domain
3. Click **Run AutoSSL**

### Via Command Line:
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

## Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click on failed workflow
   - Review error messages

2. **Verify secrets are set:**
   - Settings → Secrets and variables → Actions
   - Ensure all 4 secrets exist

3. **Test FTP connection manually:**
   ```bash
   # Try connecting via FTP client (FileZilla, etc.)
   # Host: FTP_SERVER
   # Username: FTP_USERNAME
   # Password: FTP_PASSWORD
   ```

4. **Common fixes:**
   - Re-enter FTP credentials in GitHub Secrets
   - Check for typos in secret names
   - Verify FTP directory path exists
   - Ensure FTP is enabled on server

### Application Not Starting?

1. **Check environment variables on server**
2. **Verify DATABASE_URL is correct**
3. **Check application logs in cPanel or via SSH**
4. **Ensure Node.js version is 20.x**
5. **Run database migrations manually:**
   ```bash
   cd /path/to/your/app
   npx prisma migrate deploy
   ```

## Next Steps

✅ Deployment is working? Great! Now:

1. **Set up monitoring** (UptimeRobot, Sentry, etc.)
2. **Configure database backups**
3. **Set up staging environment** (optional)
4. **Document your API** for frontend team
5. **Load test** before going live

## Need More Help?

- 📖 [Complete Deployment Guide](README-DEPLOYMENT.md)
- 🚀 [GitHub Deployment Details](GITHUB_DEPLOYMENT.md)
- 🏠 [HostPinnacle Specific Guide](HOSTPINNACLE_DEPLOYMENT.md)
- 🐛 [Troubleshooting Section](README-DEPLOYMENT.md#troubleshooting)

---

**Questions?** Open an issue on GitHub or check the comprehensive documentation in [README-DEPLOYMENT.md](README-DEPLOYMENT.md).
