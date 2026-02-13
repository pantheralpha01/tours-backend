# GitHub Actions Deployment Guide

## 🚀 Deploy via GitHub Actions

### Quick Setup

1. **Choose your deployment workflow:**
   - `simple-deploy.yml` - Basic FTP deployment (recommended for most users)
   - `deploy.yml` - Advanced workflow with staging/production environments

2. **Configure GitHub Secrets** (Go to Settings > Secrets and variables > Actions):

#### For Simple Deploy:
```
FTP_SERVER          = your.hostpinnacle-server.com
FTP_USERNAME        = your-ftp-username
FTP_PASSWORD        = your-ftp-password
FTP_SERVER_DIR      = /public_html/api/  (or your backend directory)
```

#### For Advanced Deploy (Multi-Environment):
```
# Staging Environment
STAGING_FTP_SERVER     = your-staging-server.com
STAGING_FTP_USERNAME   = staging-username
STAGING_FTP_PASSWORD   = staging-password
STAGING_SSH_HOST       = your-staging-server.com
STAGING_SSH_USERNAME   = ssh-username
STAGING_SSH_PASSWORD   = ssh-password

# Production Environment  
PROD_FTP_SERVER        = your-production-server.com
PROD_FTP_USERNAME      = prod-username
PROD_FTP_PASSWORD      = prod-password
PROD_SSH_HOST          = your-production-server.com
PROD_SSH_USERNAME      = ssh-username
PROD_SSH_PASSWORD      = ssh-password
```

### 🌐 Multi-Site Hosting Setup

#### Hosting Structure for Multiple Sites:
```
/public_html/
├── main-website/      (Your main site)
├── api/              (This backend - tours API)
├── admin/            (Admin dashboard)
└── app/              (Frontend application)
```

#### Environment Configuration:

1. **Update multi-site.config** with your actual values:
```bash
# Edit multi-site.config file
PRODUCTION_PATH="/public_html/api"
PRODUCTION_DOMAIN="api.yoursite.com"
PRODUCTION_PORT=4000
```

2. **Set environment variables in your hosting panel:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/tours_production
PORT=4000
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret

# Multi-site CORS configuration
ALLOWED_ORIGINS=https://yoursite.com,https://app.yoursite.com,https://admin.yoursite.com
```

#### Subdomain Configuration:
If using subdomains (recommended):
- `api.yoursite.com` → Points to `/public_html/api/`
- `app.yoursite.com` → Points to `/public_html/app/`
- `admin.yoursite.com` → Points to `/public_html/admin/`

### 🔄 Deployment Process

#### Automatic Deployment:
1. Push code to `main` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Runs tests and linting
   - Builds the application
   - Deploys to your server
   - Runs database migrations
   - Restarts the application

#### Manual Deployment:
1. Go to GitHub Actions tab
2. Select "Deploy Backend" workflow
3. Click "Run workflow"
4. Choose your branch and click "Run workflow"

### 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] GitHub Secrets configured
- [ ] Database created and accessible
- [ ] Environment variables set in hosting panel
- [ ] Domain/subdomain configured (if applicable)
- [ ] SSL certificates installed
- [ ] Firewall rules configured (if needed)

### 🛠️ Troubleshooting

#### Common Issues:

**1. FTP Connection Failed:**
```bash
# Check your FTP credentials in GitHub Secrets
# Verify FTP server address and port
# Ensure FTP is enabled in hosting panel
```

**2. Build Failure:**
```bash
# Check GitHub Actions logs
# Verify package.json scripts
# Ensure all dependencies are listed
```

**3. Database Connection Error:**
```bash
# Verify DATABASE_URL format
# Check database server accessibility
# Confirm database exists and user has permissions
```

**4. Port Already in Use:**
```bash
# Check if another application uses the same port
# Update PORT in environment variables
# Use process manager (PM2) to manage multiple apps
```

### 📝 Environment Variables Reference

#### Required for All Environments:
```env
DATABASE_URL=postgresql://username:password@host:port/database_name
PORT=4000
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret
ACCESS_TOKEN_SECRET=your-super-secure-access-token-secret
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret
```

#### Multi-Site Configuration:
```env
ALLOWED_ORIGINS=https://yoursite.com,https://app.yoursite.com,https://admin.yoursite.com
```

#### Optional Payment Gateway:
```env
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
MPESA_CONSUMER_KEY=your-mpesa-key
MPESA_CONSUMER_SECRET=your-mpesa-secret
```

### 🚀 Next Steps After Deployment

1. **Test your API endpoints:**
```bash
curl https://api.yoursite.com/health
curl https://api.yoursite.com/api/auth/login
```

2. **Set up monitoring:**
   - Configure uptime monitoring
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor API performance

3. **Security hardening:**
   - Review CORS settings
   - Enable rate limiting
   - Set up proper SSL/TLS
   - Configure security headers

4. **Performance optimization:**
   - Enable gzip compression
   - Set up CDN (if needed)
   - Configure caching headers
   - Monitor database performance

### 📞 Support

If you encounter issues:
1. Check GitHub Actions logs for detailed error messages
2. Review your hosting provider's documentation
3. Verify environment variables and secrets
4. Test locally first to isolate issues

---

*This guide assumes you're using HostPinnacle or similar shared hosting. Adjust paths and configurations based on your hosting provider's requirements.*