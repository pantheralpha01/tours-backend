# 📦 Live FTP Deployment - Configuration Summary

## ✅ Configuration Complete

Your repository has been configured for automatic deployment to the live FTP server at **timelessfactors.co.ke**.

## 🔐 SECURITY NOTICE

**IMPORTANT:** The actual FTP username and password should NEVER be committed to version control. Obtain these credentials from your hosting provider or secure password manager, and add them only to GitHub Secrets. This document uses placeholders for sensitive credentials.

## 🎯 What Was Configured

### 1. Live Server Credentials
The following FTP configuration has been set up for deployment:

- **FTP Server:** timelessfactors.co.ke
- **FTP Username:** [Obtain from hosting provider - DO NOT commit to repository]
- **FTP Password:** [Obtain from hosting provider - DO NOT commit to repository]
- **Server Directory:** /home2/timeles1/tours-backend/

### 2. Updated Files

#### Scripts Updated:
- ✅ `setup-secrets.sh` - Shows live FTP credentials when run
- ✅ `setup-secrets.ps1` - Shows live FTP credentials when run (Windows)

#### Documentation Created/Updated:
- ✅ `QUICK_SETUP.md` - **START HERE** - Quick 5-minute setup guide
- ✅ `LIVE_SERVER_DEPLOYMENT.md` - Comprehensive live server deployment guide
- ✅ `README.md` - Updated with live server details and links
- ✅ `GITHUB_ACTIONS_SETUP.md` - Updated with live server examples
- ✅ `DEPLOYMENT_README.md` - Updated GitHub secrets section

### 3. GitHub Actions Workflow
The existing workflow at `.github/workflows/simple-deploy.yml` is already configured to:
- ✅ Build the application on push to `main` branch
- ✅ Deploy via FTP using GitHub secrets
- ✅ Exclude unnecessary files from deployment
- ✅ Can be triggered manually from GitHub Actions tab

## 🚀 NEXT STEPS - To Enable Deployment

### Step 1: Add GitHub Secrets (REQUIRED)

Go to: https://github.com/pantheralpha01/tours-backend/settings/secrets/actions

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `FTP_SERVER` | `timelessfactors.co.ke` |
| `FTP_USERNAME` | [Obtain from hosting provider] |
| `FTP_PASSWORD` | [Obtain from hosting provider] |
| `FTP_SERVER_DIR` | `/home2/timeles1/tours-backend/` |

**How to add a secret:**
1. Click "New repository secret"
2. Enter the name (e.g., `FTP_SERVER`)
3. Enter the value (e.g., `timelessfactors.co.ke`)
4. Click "Add secret"
5. Repeat for all 4 secrets

### Step 2: Deploy

Once secrets are added:

**Option A - Automatic (Push to main):**
```bash
git push origin main
```

**Option B - Manual Trigger:**
1. Go to: https://github.com/pantheralpha01/tours-backend/actions
2. Click "Simple Deploy"
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow"

### Step 3: Post-Deployment Configuration

After first deployment, configure the server:

#### A. Set Environment Variables (via cPanel)
Go to cPanel → Setup Node.js App → Environment Variables

Add these variables:
```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
PORT=4000
NODE_ENV=production
JWT_SECRET=<generate-with-openssl-rand-base64-32>
ACCESS_TOKEN_SECRET=<generate-with-openssl-rand-base64-32>
REFRESH_TOKEN_SECRET=<generate-with-openssl-rand-base64-32>
ALLOWED_ORIGINS=https://timelessfactors.co.ke,https://www.timelessfactors.co.ke
```

#### B. Create PostgreSQL Database (via cPanel)
1. Go to cPanel → PostgreSQL Databases
2. Create database: `tours_production`
3. Create user with strong password
4. Assign user to database with ALL PRIVILEGES
5. Update `DATABASE_URL` with connection string

#### C. Run Database Migrations (via SSH)
```bash
cd /home2/timeles1/tours-backend
npx prisma migrate deploy
npx prisma generate
```

#### D. Start Application (via SSH or cPanel)
```bash
# Using PM2 (recommended)
pm2 start dist/server.js --name tours-backend-live
pm2 save
pm2 startup

# Or configure in cPanel Setup Node.js App
# Set startup file: dist/server.js
```

#### E. Enable SSL/HTTPS (via cPanel)
1. Go to cPanel → SSL/TLS Status
2. Find your domain
3. Click "Run AutoSSL"

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| [QUICK_SETUP.md](QUICK_SETUP.md) | Quick 5-minute setup guide |
| [LIVE_SERVER_DEPLOYMENT.md](LIVE_SERVER_DEPLOYMENT.md) | Complete deployment guide with troubleshooting |
| [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) | Detailed GitHub Actions configuration |
| [README.md](README.md) | Main project documentation |

## 🔍 Monitoring Deployment

Watch your deployment in real-time:
- **Actions:** https://github.com/pantheralpha01/tours-backend/actions
- **Check logs:** Click on any workflow run to see detailed logs
- **Status:** Green checkmark = success, Red X = failed

## ✅ Deployment Checklist

Use this checklist to ensure everything is configured:

- [ ] GitHub secrets added (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR)
- [ ] Deployment triggered (push to main or manual trigger)
- [ ] Deployment successful (check GitHub Actions)
- [ ] Environment variables set on server
- [ ] PostgreSQL database created
- [ ] Database migrations run
- [ ] Application started with PM2
- [ ] SSL/HTTPS enabled
- [ ] API endpoints tested

## 🧪 Testing Deployment

After deployment, test your API:

```bash
# Health check
curl https://api.timelessfactors.co.ke/health

# API documentation
curl https://api.timelessfactors.co.ke/api-docs

# Tours endpoint
curl https://api.timelessfactors.co.ke/api/tours
```

Or run the verification script:
```bash
./verify-deployment.sh https://api.timelessfactors.co.ke
```

## 🆘 Need Help?

If you encounter issues:

1. **Check GitHub Actions logs** - Most deployment issues are visible here
2. **Review LIVE_SERVER_DEPLOYMENT.md** - Contains troubleshooting section
3. **Verify secrets** - Make sure all 4 GitHub secrets are added correctly
4. **Check server logs** - Via cPanel or SSH: `pm2 logs tours-backend-live`
5. **Test FTP manually** - Use FileZilla to verify FTP credentials work

## 🎉 Summary

Your repository is **ready for deployment**! The only step remaining is to add the 4 GitHub secrets, then deployment will happen automatically on every push to the main branch.

**Start here:** [QUICK_SETUP.md](QUICK_SETUP.md)

---

**Configuration Date:** 2026-02-14  
**Live Server:** timelessfactors.co.ke  
**Deployment Path:** /home2/timeles1/tours-backend/
