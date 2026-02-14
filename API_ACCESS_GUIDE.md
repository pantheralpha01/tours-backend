# 🌐 How to Access Your Live APIs

Congratulations on completing your deployment! This guide will help you access and test your live APIs.

## 📍 Your API Base URL

Based on your deployment configuration, your API is accessible at:

```
https://api.timelessfactors.co.ke
```

or

```
https://timelessfactors.co.ke/api
```

> **Note:** The exact URL depends on your hosting configuration. Check your hosting panel or the deployment logs to confirm the correct base URL.

## 🔍 Quick Start - Test Your API

### 1. Health Check (No Authentication Required)

The simplest way to verify your API is running:

```bash
curl https://api.timelessfactors.co.ke/health
```

**Expected Response:**
```json
{
  "status": "ok"
}
```

If you see this response, your API is live and accessible! 🎉

### 2. API Documentation (Interactive)

Access the interactive Swagger documentation:

```
https://api.timelessfactors.co.ke/docs
```

> **Important:** Open this URL in your web browser to see all available endpoints, request/response formats, and even test the APIs directly!

## 🛣️ Available API Endpoints

Your backend provides the following main endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Booking Management
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `PATCH /api/bookings/:id/status` - Update booking status

### Partner Management
- `GET /api/partners` - List all partners
- `POST /api/partners` - Create new partner
- `GET /api/partners/:id` - Get partner details
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Quote Management
- `GET /api/quotes` - List all quotes
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/:id` - Get quote details
- `PUT /api/quotes/:id` - Update quote
- `DELETE /api/quotes/:id` - Delete quote

### Payment Processing
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get payment details

### Contract Management
- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create new contract
- `GET /api/contracts/:id` - Get contract details

### Inventory Management
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Create inventory item
- `GET /api/inventory/:id` - Get inventory details

### Additional Endpoints
- `GET /api/receipts` - Receipt management
- `GET /api/disputes` - Dispute management
- `GET /api/refunds` - Refund management
- `GET /api/integrations` - Integration management
- `GET /api/dispatches` - Dispatch management

## 🔐 Authentication

Most endpoints require authentication. Here's how to get started:

### Step 1: Login to Get Access Token

```bash
curl -X POST https://api.timelessfactors.co.ke/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### Step 2: Use Access Token in Requests

Include the access token in the Authorization header:

```bash
curl https://api.timelessfactors.co.ke/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Example API Calls

### Example 1: Create a New Booking

```bash
curl -X POST https://api.timelessfactors.co.ke/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "customerId": "customer-id",
    "tourDate": "2026-03-15",
    "numberOfGuests": 4,
    "totalAmount": 500.00
  }'
```

### Example 2: List All Bookings

```bash
curl https://api.timelessfactors.co.ke/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example 3: Get Specific Booking

```bash
curl https://api.timelessfactors.co.ke/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example 4: Update Booking Status

```bash
curl -X PATCH https://api.timelessfactors.co.ke/api/bookings/BOOKING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

## 🧪 Testing Your APIs

### Using cURL (Command Line)

The examples above use cURL. Install it if needed:

**Linux/Mac:**
```bash
# Usually pre-installed
curl --version
```

**Windows:**
```powershell
# PowerShell alternative to curl
Invoke-WebRequest -Uri "https://api.timelessfactors.co.ke/health"
```

### Using Postman

1. **Download Postman:** https://www.postman.com/downloads/
2. **Import Collection:** Use the included Postman collection files:
   - `Comprehensive_State_Machine_Tests.postman_collection.json`
   - `Comprehensive_Tests_Environment.postman_environment.json`
3. **Update Environment Variables:**
   - Set `baseUrl` to `https://api.timelessfactors.co.ke`
4. **Run Tests:** Execute individual requests or the entire collection

See [POSTMAN_SETUP_GUIDE.md](POSTMAN_SETUP_GUIDE.md) for detailed Postman setup instructions.

### Using Your Browser

For GET requests and documentation:

1. **API Documentation:**
   ```
   https://api.timelessfactors.co.ke/docs
   ```
   
2. **Health Check:**
   ```
   https://api.timelessfactors.co.ke/health
   ```

### Using JavaScript/Fetch

```javascript
// Example: Fetch bookings
const response = await fetch('https://api.timelessfactors.co.ke/api/bookings', {
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
});
const data = await response.json();
console.log(data);
```

### Using Python

```python
import requests

# Example: Get health status
response = requests.get('https://api.timelessfactors.co.ke/health')
print(response.json())

# Example: Login
login_response = requests.post(
    'https://api.timelessfactors.co.ke/api/auth/login',
    json={'email': 'admin@example.com', 'password': 'password'}
)
token = login_response.json()['accessToken']

# Example: Get bookings with authentication
bookings_response = requests.get(
    'https://api.timelessfactors.co.ke/api/bookings',
    headers={'Authorization': f'Bearer {token}'}
)
print(bookings_response.json())
```

## 🔧 Verification Script

Use the included verification script to test multiple endpoints:

```bash
# Make script executable
chmod +x verify-deployment.sh

# Run verification
./verify-deployment.sh https://api.timelessfactors.co.ke
```

This script will test:
- ✅ Health endpoint
- ✅ API documentation
- ✅ Authentication endpoints
- ✅ Main API endpoints

## 🚨 Troubleshooting

### Issue 1: "Connection Refused" or "Cannot Connect"

**Possible Causes:**
- API server is not running
- Wrong base URL
- Firewall blocking requests

**Solutions:**
1. Verify the API is running on your server:
   ```bash
   ssh user@timelessfactors.co.ke
   pm2 status
   # Should show tours-backend running
   ```

2. Check server logs:
   ```bash
   pm2 logs tours-backend-live
   ```

3. Verify the correct URL in your hosting panel

### Issue 2: "404 Not Found"

**Possible Causes:**
- Incorrect endpoint path
- API not deployed correctly

**Solutions:**
1. Verify endpoint path (should start with `/api/`)
2. Check API documentation at `/docs`
3. Review deployment logs in GitHub Actions

### Issue 3: "401 Unauthorized"

**Possible Causes:**
- Missing or invalid access token
- Token expired

**Solutions:**
1. Ensure you're sending the Authorization header:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```
2. Login again to get a fresh token
3. Check token hasn't expired (default: 15 minutes)

### Issue 4: "403 Forbidden"

**Possible Causes:**
- User doesn't have permission
- CORS issue (browser only)

**Solutions:**
1. Verify user role and permissions
2. Check CORS configuration in environment variables:
   ```
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

### Issue 5: "500 Internal Server Error"

**Possible Causes:**
- Database connection issue
- Missing environment variables
- Application error

**Solutions:**
1. Check server logs:
   ```bash
   pm2 logs tours-backend-live
   ```
2. Verify environment variables are set correctly
3. Check database connection

### Issue 6: CORS Errors (Browser)

If you see CORS errors in browser console:

**Solution:**
Update `ALLOWED_ORIGINS` environment variable on server:
```env
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

Then restart the application:
```bash
pm2 restart tours-backend-live
```

## 📱 Connecting Your Frontend

To connect your frontend application to this API:

1. **Set API Base URL** in your frontend configuration:
   ```javascript
   const API_BASE_URL = 'https://api.timelessfactors.co.ke';
   ```

2. **Configure CORS** on server (see environment variables):
   ```env
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

3. **Implement Authentication Flow:**
   - Store access token after login
   - Include token in all authenticated requests
   - Refresh token when expired
   - Handle logout properly

4. **Example Frontend Integration:**
   ```javascript
   // api.js - API client
   const API_BASE_URL = 'https://api.timelessfactors.co.ke';
   
   export const api = {
     async login(email, password) {
       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password })
       });
       const data = await response.json();
       localStorage.setItem('accessToken', data.accessToken);
       return data;
     },
     
     async getBookings() {
       const token = localStorage.getItem('accessToken');
       const response = await fetch(`${API_BASE_URL}/api/bookings`, {
         headers: { 'Authorization': `Bearer ${token}` }
       });
       return response.json();
     }
   };
   ```

## 📊 Monitoring Your API

### Check API Status

```bash
# Health check
curl https://api.timelessfactors.co.ke/health

# Check process status (on server)
ssh user@timelessfactors.co.ke
pm2 status
```

### View Logs

```bash
# SSH into server
ssh user@timelessfactors.co.ke

# View live logs
pm2 logs tours-backend-live

# View error logs only
pm2 logs tours-backend-live --err

# View last 100 lines
pm2 logs tours-backend-live --lines 100
```

### Restart API (if needed)

```bash
# SSH into server
ssh user@timelessfactors.co.ke

# Restart application
pm2 restart tours-backend-live

# Or reload (zero-downtime)
pm2 reload tours-backend-live
```

## 📚 Additional Resources

- **[Swagger Documentation](https://api.timelessfactors.co.ke/docs)** - Interactive API explorer
- **[Postman Setup Guide](POSTMAN_SETUP_GUIDE.md)** - Set up Postman for testing
- **[Deployment Guide](README-DEPLOYMENT.md)** - Full deployment documentation
- **[Troubleshooting](README-DEPLOYMENT.md#troubleshooting)** - Common issues and solutions

## 🎯 Quick Reference Card

```
Base URL:     https://api.timelessfactors.co.ke
Health:       /health
Docs:         /docs
Auth Login:   POST /api/auth/login
Bookings:     /api/bookings
Partners:     /api/partners
Quotes:       /api/quotes
Payments:     /api/payments
```

## ✅ Next Steps

Now that you can access your API:

1. ✅ **Test all endpoints** using Postman or cURL
2. ✅ **Connect your frontend** to the API
3. ✅ **Set up monitoring** (UptimeRobot, Pingdom, etc.)
4. ✅ **Configure error tracking** (Sentry, LogRocket, etc.)
5. ✅ **Set up database backups** (if not already done)
6. ✅ **Create API usage documentation** for your team
7. ✅ **Test with production data** (carefully!)

## 🎉 You're All Set!

Your API is now live and accessible. Start building amazing features! 🚀

---

**Questions or Issues?** Check the troubleshooting section above or review the [Complete Deployment Guide](README-DEPLOYMENT.md).
