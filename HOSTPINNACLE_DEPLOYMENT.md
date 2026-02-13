# HostPinnacle Deployment Guide

## � New: GitHub Actions Deployment
**For automated deployments via GitHub, see [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)**

This guide covers manual deployment. For CI/CD automation, use GitHub Actions instead.

## �📋 Pre-Deployment Checklist

### 1. Prepare Your Database
**Option A: PostgreSQL on HostPinnacle**
- Create a PostgreSQL database instance
- Note down: host, port, database name, username, password

**Option B: External Database (Recommended)**
- Use services like [Aiven](https://aiven.io/), [DigitalOcean](https://www.digitalocean.com/products/managed-databases), or [Railway](https://railway.app/)
- More reliable for production workloads

### 2. Environment Variables Setup
Create these environment variables in HostPinnacle control panel:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# Server Configuration  
PORT=4000
NODE_ENV=production

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=your-super-secure-jwt-secret-here
ACCESS_TOKEN_SECRET=your-super-secure-access-token-secret
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret

# CORS Origins (Add your frontend URLs)
ALLOWED_ORIGINS=https://yourfrontend.com,https://yourdomain.hostpinnacle.com

# Optional Payment Gateway Keys (if using payments)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
MPESA_CONSUMER_KEY=your-mpesa-key
MPESA_CONSUMER_SECRET=your-mpesa-secret
```

⚠️ **Security Note**: Never commit real secrets to Git!

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

1. **Add Health Check Endpoint** (for monitoring):
```bash
# This is already done - check src/app.ts for /health endpoint
```

2. **Update package.json scripts**:
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc && npx prisma generate",  
    "postbuild": "npx prisma migrate deploy"
  }
}
```

### Step 2: Database Migration Strategy

**Option A: Pre-migration (Recommended)**
```bash
# Run locally first to test
npx prisma migrate deploy
npx prisma generate
```

**Option B: Auto-migration on deploy**
- Database migrations run automatically via `postbuild` script

### Step 3: Deploy to HostPinnacle

#### Method 1: Git Deployment (Recommended)
1. **Push to Git repository**:
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

2. **Connect Git in HostPinnacle**:
   - Go to HostPinnacle control panel
   - Create new Node.js application
   - Connect your Git repository
   - Set branch to `main`
   - Set build command: `npm run build`
   - Set start command: `npm start`

#### Method 2: File Upload
1. **Build locally**:
```bash
npm run build
```

2. **Create deployment package**:
```bash
# Exclude development files
zip -r backend-deploy.zip . -x "node_modules/*" "src/*" "*.log" ".env" ".git/*"
```

3. **Upload to HostPinnacle**:
   - Upload zip file via control panel
   - Extract in application directory

### Step 4: Configure HostPinnacle Settings

1. **Application Type**: Node.js
2. **Node Version**: 20.x LTS
3. **Start Command**: `npm start`
4. **Build Command**: `npm run build`
5. **Environment Variables**: Add all from list above

### Step 5: Domain & SSL Setup

1. **Custom Domain** (Optional):
   - Add your domain in HostPinnacle DNS settings
   - Update CORS origins in environment variables

2. **SSL Certificate**:
   - Enable auto SSL in HostPinnacle
   - Or upload custom certificate

## 🔧 Post-Deployment

### 1. Verify Deployment
```bash
# Test health endpoint
curl https://your-app.hostpinnacle.com/health

# Test authentication
curl -X POST https://your-app.hostpinnacle.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Admin@123"}'
```

### 2. Run Initial Data Seed
```bash
# Option A: Via HostPinnacle terminal/console
npm run seed

# Option B: Via API call after deployment
curl -X POST https://your-app.hostpinnacle.com/api/auth/seed \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Monitor Logs
- Check HostPinnacle application logs
- Set up error monitoring (Sentry, LogRocket)

## 🔄 CI/CD Setup (Optional)

### Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to HostPinnacle

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test # Add when you have tests
        
      - name: Deploy to HostPinnacle
        # Use HostPinnacle's deployment action or webhook
        run: |
          curl -X POST ${{ secrets.HOSTPINNACLE_WEBHOOK_URL }} \\
            -H "Authorization: ${{ secrets.HOSTPINNACLE_API_KEY }}"
```

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Errors**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database accepts external connections

**2. Build Failures**
- Check Node.js version compatibility  
- Verify all dependencies in package.json
- Check TypeScript compilation errors

**3. Environment Variable Issues**
- Ensure all required variables are set
- Check for typos in variable names
- Verify secret generation

**4. CORS Errors**
- Update ALLOWED_ORIGINS with correct frontend URLs
- Include protocol (https://) in origins

### Performance Optimization

**1. Enable Compression**:
```javascript
// Add to app.ts
app.use(compression());
```

**2. Database Connection Pooling**:
```javascript
// In prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  },
  // Add connection pooling for production
});
```

## 📞 Support

- **HostPinnacle Docs**: Check their Node.js deployment guide
- **Database Issues**: Contact your database provider
- **Application Errors**: Check application logs in HostPinnacle panel

## 🔐 Security Checklist

- [ ] Strong JWT secrets generated
- [ ] DATABASE_URL uses SSL (`sslmode=require`)  
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet middleware active
- [ ] No secrets committed to Git
- [ ] Database backups configured
- [ ] SSL certificate installed

---

## Quick Commands Reference

```bash
# Local testing
npm run dev

# Production build
npm run build
npm start

# Database operations
npx prisma migrate deploy
npx prisma generate
npx prisma studio

# Health check
curl https://your-app.hostpinnacle.com/health
```