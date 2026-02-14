# ⚡ Quick Setup Guide for Live Deployment

## 🎯 IMPORTANT SECURITY NOTE

**The actual FTP credentials should NEVER be committed to version control.**  
This guide shows placeholders - obtain the actual credentials from your hosting provider or secure password manager.

## 🔐 Where to Get Credentials

Contact your hosting provider or system administrator to obtain:
- FTP username
- FTP password

## 📋 Step-by-Step Instructions

### 1. Go to GitHub Repository Settings

Navigate to: https://github.com/pantheralpha01/tours-backend/settings/secrets/actions

### 2. Add These 4 Secrets

Click **"New repository secret"** for each of these:

#### Secret 1: FTP_SERVER
```
Name: FTP_SERVER
Value: timelessfactors.co.ke
```

#### Secret 2: FTP_USERNAME
```
Name: FTP_USERNAME
Value: [Obtain from hosting provider]
```

#### Secret 3: FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: [Obtain from hosting provider]
```

#### Secret 4: FTP_SERVER_DIR
```
Name: FTP_SERVER_DIR
Value: /home2/timeles1/tours-backend/
```

### 3. Deploy Automatically

Once secrets are added, any push to the `main` branch will automatically deploy to your live server!

```bash
git push origin main
```

Or manually trigger deployment:
1. Go to: https://github.com/pantheralpha01/tours-backend/actions
2. Click "Simple Deploy"
3. Click "Run workflow"
4. Select "main" branch
5. Click "Run workflow" button

## 🔍 Monitor Deployment

Watch deployment progress in real-time:
https://github.com/pantheralpha01/tours-backend/actions

## 📚 Detailed Documentation

For complete setup instructions, see:
- [LIVE_SERVER_DEPLOYMENT.md](LIVE_SERVER_DEPLOYMENT.md) - Full deployment guide
- [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) - GitHub Actions setup

## ⚠️ Important Next Steps

After first deployment, you'll need to:

1. **Set environment variables on the server** (via cPanel)
   - DATABASE_URL
   - JWT_SECRET (generate with: `openssl rand -base64 32`)
   - ACCESS_TOKEN_SECRET
   - REFRESH_TOKEN_SECRET
   - Other variables from `.env.example`

2. **Run database migrations** (via SSH)
   ```bash
   cd /home2/timeles1/tours-backend
   npx prisma migrate deploy
   ```

3. **Start the application** (via cPanel or PM2)
   ```bash
   pm2 start dist/server.js --name tours-backend-live
   ```

4. **Enable HTTPS/SSL** (via cPanel)
   - Go to SSL/TLS Status
   - Click "Run AutoSSL"

## ✅ Quick Checklist

- [ ] Add 4 GitHub secrets (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR)
- [ ] Push to main branch or trigger manual deployment
- [ ] Set environment variables on server
- [ ] Run database migrations
- [ ] Start application with PM2
- [ ] Enable SSL/HTTPS
- [ ] Test API endpoints

---

**Need Help?** See [LIVE_SERVER_DEPLOYMENT.md](LIVE_SERVER_DEPLOYMENT.md) for troubleshooting and detailed setup.
