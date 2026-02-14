# 🚀 Tours Backend Deployment Options

## Quick Start

### Option 1: GitHub Actions (Recommended)
Automated deployment with every push to main branch.

**Setup Steps:**
1. Follow [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)
2. Configure GitHub Secrets 
3. Push to `main` branch → Auto-deploy! 

### Option 2: Manual Deployment  
Traditional manual deployment process.

**Setup Steps:**
1. Follow [HOSTPINNACLE_DEPLOYMENT.md](HOSTPINNACLE_DEPLOYMENT.md)
2. Run deployment scripts
3. Upload files manually

## 🌐 Multi-Site Hosting

If you have multiple sites on the same hosting account:
- See [multi-site.config](multi-site.config) for configuration
- Use subdomains for better organization
- Configure proper CORS settings

## 📁 Project Structure

```bash
backend/
├── .github/workflows/          # GitHub Actions
│   ├── deploy.yml              # Full CI/CD pipeline  
│   └── simple-deploy.yml       # Basic deployment
├── src/                        # Source code
├── prisma/                     # Database schema
├── multi-site.config           # Multi-site configuration
├── GITHUB_DEPLOYMENT.md        # GitHub Actions guide
├── HOSTPINNACLE_DEPLOYMENT.md  # Manual deployment guide
└── DEPLOYMENT_README.md        # This file
```

## 🔧 Environment Setup

### Required Environment Variables:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=4000
NODE_ENV=production
JWT_SECRET=your-secret
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret
ALLOWED_ORIGINS=https://yoursite.com
```

### GitHub Secrets (for auto-deploy):
```
FTP_SERVER=timelessfactors.co.ke
FTP_USERNAME=[Your FTP username]
FTP_PASSWORD=[Your FTP password]
FTP_SERVER_DIR=/home2/timeles1/tours-backend/
```

## ⚡ Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy (manual)
./deploy.ps1        # Windows
./deploy.sh         # Linux/Mac

# Database migrations
npx prisma migrate deploy
```

## 🚨 Important Notes

1. **Never commit secrets** to Git
2. **Test locally first** before deploying
3. **Backup database** before migrations
4. **Configure CORS** for multiple sites
5. **Use HTTPS** in production

## 📞 Need Help?

- GitHub Actions issues: Check Actions tab for logs
- Manual deployment: Review deployment guides
- Multi-site setup: Check hosting provider docs
- Database issues: Verify connection strings

---

Choose your deployment method and follow the corresponding guide!