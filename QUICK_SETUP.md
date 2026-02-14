# ⚡ Quick Setup Guide for Live Deployment

## 🎯 IMMEDIATE ACTION REQUIRED

To enable automatic deployment to your live server at **timelessfactors.co.ke**, you need to add these secrets to your GitHub repository.

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
Value: timeles1
```

#### Secret 3: FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: Timeless@2025
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
