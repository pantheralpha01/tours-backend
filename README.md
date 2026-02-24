# Tours Backend API

A comprehensive Node.js backend API for managing tours, bookings, agents, and customer interactions.

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pantheralpha01/tours-backend.git
   cd tours-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

4. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:4000`

### API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:4000/api-docs`
- **Health Check:** `http://localhost:4000/health`

## 📦 Deployment

Ready to deploy to production? See our guides:

### [⚡ Quick Setup for Live Server →](QUICK_SETUP.md)
### [📖 Complete Deployment Guide →](README-DEPLOYMENT.md)
### [🚀 Live Server Deployment →](LIVE_SERVER_DEPLOYMENT.md)

### Quick Deploy with GitHub Actions

1. **Configure GitHub Secrets:**
   - `FTP_SERVER` - timelessfactors.co.ke
   - `FTP_USERNAME` - [Your FTP username]
   - `FTP_PASSWORD` - [Your FTP password]
   - `FTP_SERVER_DIR` - /home2/timeles1/tours-backend/

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. **That's it!** GitHub Actions will automatically build and deploy your app.

For detailed deployment instructions, environment setup, troubleshooting, and more, see [QUICK_SETUP.md](QUICK_SETUP.md) or [LIVE_SERVER_DEPLOYMENT.md](LIVE_SERVER_DEPLOYMENT.md).

## 🌐 Accessing Your Live APIs

**Deployment complete? Ready to use your APIs?**

### [📘 View Complete API Access Guide →](API_ACCESS_GUIDE.md)

Quick access:
- **Your API Base URL:** `https://api.timelessfactors.co.ke`
- **Health Check:** `https://api.timelessfactors.co.ke/health`
- **API Documentation:** `https://api.timelessfactors.co.ke/docs`
- **Available Endpoints:** Authentication, Bookings, Partners, Quotes, Payments, and more

The API Access Guide includes:
- ✅ Complete endpoint list
- ✅ Authentication examples
- ✅ Testing with cURL, Postman, Python, JavaScript
- ✅ Frontend integration examples
- ✅ Troubleshooting common issues

## 🏗️ Project Structure

```
tours-backend/
├── src/
│   ├── modules/          # Business logic (tours, bookings, agents, etc.)
│   ├── routes/           # API route definitions
│   ├── middleware/       # Express middleware (auth, validation, etc.)
│   ├── config/           # Configuration files
│   ├── integrations/     # Third-party integrations
│   ├── utils/            # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .github/
│   └── workflows/       # CI/CD workflows
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README-DEPLOYMENT.md # Detailed deployment guide
```

## 🛠️ Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run lint             # Run ESLint
```

## 🔧 Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger/OpenAPI
- **Security:** Helmet, CORS, Rate Limiting

## 📚 Key Features

- ✅ **Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Tours Management** - CRUD operations for tours with availability tracking
- ✅ **Booking System** - Complete booking workflow with state management
- ✅ **Agent Portal** - Multi-agent support with commission tracking
- ✅ **Payment Integration** - PayPal, M-Pesa, and card gateway support
- ✅ **Communication** - SMS/WhatsApp notifications via Twilio
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Security** - Rate limiting, CORS, helmet, input validation
- ✅ **Database Migrations** - Version-controlled schema changes

## 🔐 Environment Variables

See [.env.example](.env.example) for all available environment variables.

### Required Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/database
PORT=4000
NODE_ENV=production
JWT_SECRET=your-secret-here
ACCESS_TOKEN_SECRET=your-secret-here
REFRESH_TOKEN_SECRET=your-secret-here
ALLOWED_ORIGINS=https://yourdomain.com
```

### Optional Variables:

Payment gateways, SMS/WhatsApp, Airtable integration, etc. See [.env.example](.env.example) for details.

Community module and digest notifications:

```env
COMMUNITY_PUBLIC_BASE_URL=https://portal.example.com/community
COMMUNITY_DIGEST_SCHEDULER_ENABLED=true
COMMUNITY_DIGEST_SCHEDULER_INTERVAL_MS=86400000
COMMUNITY_DIGEST_SINCE_HOURS=24
```

## 🧪 Testing

Test your deployment with the verification script:

```bash
# Test local deployment
./verify-deployment.sh http://localhost:4000

# Test production deployment
./verify-deployment.sh https://api.yourdomain.com
```

Or use the included Postman collection:
- Import `Comprehensive_State_Machine_Tests.postman_collection.json`
- Import `Comprehensive_Tests_Environment.postman_environment.json`
- Run the collection to test all endpoints

## 📨 Community Module Quickstart

The community feed, moderation tools, and digest notifications are live behind `/api/community`. Follow these steps to try them locally or on Swagger UI:

1. **Apply the latest schema**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
2. **Set the public URL + scheduler config** in `.env`:
   ```env
   COMMUNITY_PUBLIC_BASE_URL=http://localhost:5173/community
   COMMUNITY_DIGEST_SCHEDULER_ENABLED=true
   COMMUNITY_DIGEST_SCHEDULER_INTERVAL_MS=86400000
   COMMUNITY_DIGEST_SINCE_HOURS=24
   ```
3. **Start the dev server and schedulers**
   ```bash
   npm run dev
   ```
   The notification + community digest schedulers start automatically (see `src/server.ts`).
4. **Explore the endpoints on Swagger UI** at `http://localhost:4000/api-docs` → look for the **Community** tag. Key flows:
   - `GET /api/community/feed` for the personalized feed
   - `POST /api/community/posts` to publish new posts
   - `POST /api/community/posts/{id}/flag` & `/moderate` to review content
   - `GET/POST/DELETE /api/community/subscriptions` to manage instant vs daily digests
   - `POST /api/community/digest/send` to trigger a digest on demand (ADMIN/MANAGER)
5. **Run the automated tests** to verify the services/controllers covering feed, moderation, subscriptions, and digests:
   ```bash
   npm run test
   npm run lint
   ```

## 🐛 Troubleshooting

Having issues? Check the troubleshooting section in [README-DEPLOYMENT.md](README-DEPLOYMENT.md#troubleshooting).

Common issues:
- Database connection errors → Check DATABASE_URL format
- Port already in use → Kill process or change PORT
- CORS errors → Update ALLOWED_ORIGINS
- Build failures → Run `npm ci` and `npx prisma generate`

## 📖 Additional Documentation

- [QUICK_SETUP.md](QUICK_SETUP.md) - Quick setup for live deployment
- [LIVE_SERVER_DEPLOYMENT.md](LIVE_SERVER_DEPLOYMENT.md) - Live server deployment guide
- [DEPLOYMENT_README.md](DEPLOYMENT_README.md) - Deployment options overview
- [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) - GitHub Actions details
- [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) - GitHub Actions setup steps
- [HOSTPINNACLE_DEPLOYMENT.md](HOSTPINNACLE_DEPLOYMENT.md) - HostPinnacle specific guide
- [POSTMAN_SETUP_GUIDE.md](POSTMAN_SETUP_GUIDE.md) - API testing with Postman
- [TRANSITION_TEST_STEPS.md](TRANSITION_TEST_STEPS.md) - Booking state transitions

## 🔒 Security

- All secrets must be in environment variables
- JWT tokens expire and can be refreshed
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation with Zod

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review GitHub Actions logs for deployment issues

---

**Ready to deploy?** → [Start here: README-DEPLOYMENT.md](README-DEPLOYMENT.md)
