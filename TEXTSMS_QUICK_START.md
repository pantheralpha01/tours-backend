# TextSMS Credentials Quick Reference

## Your Current Credentials

```
API URL:    https://sms.textsms.co.ke/api/services/sendsms
API Key:    42bc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2ybfbf745184d30177ae4c
Partner ID: 12554
Shortcode:  TextSMS
```

## Where to Put These

### 1. Local Development (`.env` file)

```bash
# Navigate to backend folder
cd backend

# Edit .env file
nano .env
# or
vim .env
# or use VS Code
code .env
```

Add these lines:

```dotenv
# TextSMS Configuration for Phone Verification & Password Reset
TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
TEXTSMS_API_KEY=42bc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2ybfbf745184d30177ae4c
TEXTSMS_PARTNER_ID=12554
TEXTSMS_SHORTCODE=TextSMS
```

Save and restart your backend:

```bash
npm run dev
```

### 2. VPS/Production Deployment

SSH into your server:

```bash
ssh user@your-domain.com

# Navigate to your env file location
cd /etc/tours/backend/
# or your actual location

# Edit with sudo
sudo nano .env
```

Add the same configuration, then restart:

```bash
sudo systemctl restart backend
# or if using Docker:
docker-compose restart backend
```

### 3. Docker/Container Deployment

Add to your `docker-compose.yml`:

```yaml
environment:
  - TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
  - TEXTSMS_API_KEY=42bc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2ybfbf745184d30177ae4c
  - TEXTSMS_PARTNER_ID=12554
  - TEXTSMS_SHORTCODE=TextSMS
```

## How It Works Once Configured

### Password Reset (Email + SMS)

```
User submits: POST /api/auth/password/forgot
System sends:
  ✅ Email with reset link
  ✅ SMS with reset code (if phone number on file)

User receives SMS like:
"Reset your password: [link]. Valid for 30 minutes."
```

### Phone Verification (if enabled)

```
User registers with phone
System sends SMS with verification code
User enters code to verify
```

## Test It

Once configured, test with curl:

```bash
# Test password reset sends SMS
curl -X POST http://localhost:4000/api/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{"email": "your.email@example.com"}'

# Check your phone for SMS!
```

## Integration Services

The system has 3 services available:

1. **sendVerificationCode(phone, code)** - Send OTP for signup
2. **sendPasswordResetCode(phone, code, link)** - Send reset link + code
3. **sendOtp(phone, otp, purpose)** - Send generic OTP

All in: `backend/src/integrations/textsms.ts`

## Troubleshooting

### SMS Not Sending?

Check 1: Environment loaded?
```bash
# Restart backend and check logs
npm run dev
# Should show TextSMS config loading
```

Check 2: Valid phone format?
```
✅ +254712345678
✅ 0712345678
✖️ 712345678 (missing country code)
```

Check 3: TextSMS account has credits?
```
Visit: https://portal.textsms.co.ke/
Login and top up if balance is low
```

## Files Modified/Created

1. **New:** `backend/src/integrations/textsms.ts` - TextSMS service
2. **Updated:** `backend/src/config/index.ts` - Added TextSMS config
3. **Updated:** `backend/src/modules/auth/auth.service.ts` - Sends SMS on password reset
4. **Updated:** `backend/.env` - Added credentials
5. **Updated:** `backend/.env.example` - Added template
6. **New:** `backend/TEXTSMS_INTEGRATION_GUIDE.md` - Full documentation
7. **Updated:** `backend/README.md` - Added reference

## Next Steps

1. ✅ Copy credentials from above into your `.env`
2. ✅ Restart backend (`npm run dev`)
3. ✅ Test with curl command above
4. ✅ Check phone for test SMS
5. ✅ Monitor TextSMS portal for delivery status

## Additional Resources

- **TextSMS Portal:** https://portal.textsms.co.ke/
- **Full Guide:** `backend/TEXTSMS_INTEGRATION_GUIDE.md`
- **API Reference:** `backend/src/integrations/textsms.ts`
- **Auth Code:** `backend/src/modules/auth/auth.service.ts`
