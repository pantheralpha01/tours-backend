# TextSMS Integration Guide

This guide explains how to integrate TextSMS for SMS-based phone verification and password reset functionality.

## Overview

TextSMS is used for:
- **Phone verification during registration** - Send OTP to verify user's phone number
- **Password reset via SMS** - Send password reset link and code to user's phone
- **Two-factor authentication** - Send OTP for sensitive operations

## Getting Started

### 1. Create TextSMS Account

1. Visit [TextSMS Official Website](https://textsms.co.ke/)
2. Sign up for a business account
3. Complete KYC verification (required for SMS in Kenya)
4. Wait for account approval

### 2. Get Your Credentials

After account approval:

1. Log in to [TextSMS Portal](https://portal.textsms.co.ke/)
2. Navigate to **API Settings** or **Integrations**
3. You'll find:
   - **API URL**: `https://sms.textsms.co.ke/api/services/sendsms` (standard)
   - **API Key**: 64-character unique identifier
   - **Partner ID**: Numeric ID (e.g., "12554")
   - **Shortcode**: Your SMS shortcode (e.g., "TextSMS", "Tours", etc.)

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
# TextSMS Configuration for Phone Verification & Password Reset
TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
TEXTSMS_API_KEY=your-64-character-api-key
TEXTSMS_PARTNER_ID=your-numeric-partner-id
TEXTSMS_SHORTCODE=Your Shortcode
```

**Example with real values:**

```env
TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
TEXTSMS_API_KEY=42bc1q5mlw63yd2u2cn0hs6jnzf2gljhr486u3dkgm2ybfbf745184d30177ae4c
TEXTSMS_PARTNER_ID=12554
TEXTSMS_SHORTCODE=TextSMS
```

## Where to Put Credentials

### For Development

Edit: `backend/.env`

```dotenv
# Section: TextSMS Integration for Phone Verification & Password Reset
TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
TEXTSMS_API_KEY=your-api-key-here
TEXTSMS_PARTNER_ID=your-partner-id
TEXTSMS_SHORTCODE=Your Shortcode
```

### For Production/VPS

1. SSH into your server:
   ```bash
   ssh user@your-domain.com
   ```

2. Edit the `.env` file:
   ```bash
   sudo nano /etc/tours/backend/.env
   ```

3. Add/update the TextSMS section:
   ```env
   TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
   TEXTSMS_API_KEY=your-production-api-key
   TEXTSMS_PARTNER_ID=your-production-partner-id
   TEXTSMS_SHORTCODE=Your Production Shortcode
   ```

4. Save and reload the application:
   ```bash
   sudo systemctl restart backend
   # or if using Docker:
   docker-compose restart backend
   ```

### For Docker Deployment

Add to your `docker-compose.yml`:

```yaml
environment:
  - TEXTSMS_API_URL=https://sms.textsms.co.ke/api/services/sendsms
  - TEXTSMS_API_KEY=${TEXTSMS_API_KEY}
  - TEXTSMS_PARTNER_ID=${TEXTSMS_PARTNER_ID}
  - TEXTSMS_SHORTCODE=${TEXTSMS_SHORTCODE}
```

Then pass secrets via `.env` or Docker secrets.

## How It Works

### 1. Password Reset Flow

```
User Request: POST /api/auth/password/forgot
  ↓
Check email exists
  ↓
Generate reset token (30-min expiry)
  ↓
Send Email + SMS
  ├─ Email: Reset link with token
  └─ SMS: Reset code to phone (if available)
  ↓
User clicks link or enters code
  ↓
User sets new password
  ↓
All old tokens revoked
```

### 2. Phone Verification Flow (if implemented)

```
User registers with phone
  ↓
Generate OTP (6 digits)
  ↓
Send SMS with code
  ↓
User enters code
  ↓
Phone marked verified
```

## API Endpoints

### Send Verification Code

```bash
curl -X POST http://localhost:4000/api/auth/phone/verify/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254712345678"
  }'
```

### Request Password Reset (Sends Both Email & SMS)

```bash
curl -X POST http://localhost:4000/api/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

Response:
```json
{
  "message": "If an account exists, a reset link has been sent via email or SMS",
  "expiresAt": "2026-03-04T17:04:31.123Z"
}
```

### Reset Password with Token

```bash
curl -X POST http://localhost:4000/api/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email-or-sms",
    "password": "NewSecurePassword123"
  }'
```

## Phone Number Format

The service accepts multiple phone number formats:

✅ **Accepted:**
- `+254712345678` (International format)
- `0712345678` (Local format)
- `254712345678` (Without +)

❌ **Not Accepted:**
- `712345678` (Missing country code)
- `+1234567890` (Wrong country)

The system automatically normalizes all formats to: `254712345678`

## SMS Content Examples

### Verification Code SMS

```
Your verification code is: 123456. It expires in 10 minutes. 
Do not share this code with anyone.
```

### Password Reset SMS

```
Reset your password: https://app.tours.com/reset-password?token=xxx... 
Code: abc123def456. Valid for 30 minutes.
```

### OTP SMS

```
Your login OTP is: 654321. It expires in 5 minutes. 
Never share your OTP.
```

## Managing Credits & Balance

### Check Balance

1. Log in to [TextSMS Portal](https://portal.textsms.co.ke/)
2. Go to **Billing** or **Account**
3. View current credit balance

### Add Credits

1. Go to **Billing** → **Top Up**
2. Choose payment method (M-Pesa, Card, Bank Transfer)
3. Enter amount
4. Complete payment

### Monitor Usage

1. Go to **Reports** or **Analytics**
2. View SMS sent, delivered, failed
3. Track costs per SMS

## Troubleshooting

### SMS Not Sending

**Check 1: Environment Variables**
```bash
# Verify credentials are loaded
npm run dev
# Look for: "[TextSMS] Configured" or similar in logs
```

**Check 2: Phone Number Format**
```
Invalid: +1 254 712 345 678 (spaces)
Valid:   +254712345678
```

**Check 3: API Response**
```
API returns:
- status: "success" → SMS queued ✅
- status: "error" → Check API key or credential
```

**Check 4: TextSMS Balance**
- Insufficient credits → Cannot send SMS
- Top up account at portal.textsms.co.ke

### Error Messages

| Error | Solution |
|-------|----------|
| `TEXTSMS_NOT_CONFIGURED` | Add credentials to .env and restart |
| `Invalid phone number format` | Use +254XXXXXXXXX format |
| `API Key invalid` | Verify key in TextSMS portal |
| `Partner ID mismatch` | Check partner ID matches account |
| `Insufficient credits` | Top up balance in TextSMS portal |

## Security Best Practices

1. **Never commit .env file to Git**
   ```bash
   # .gitignore should contain:
   .env
   .env.local
   .env.*.local
   ```

2. **Use separate credentials for environments**
   - Development: Dev TextSMS account
   - Production: Production TextSMS account
   - Testing: Use TextSMS test mode if available

3. **Monitor API key usage**
   - Check API logs in TextSMS portal
   - Rotate keys periodically (every 90 days)
   - Never share API key via email or chat

4. **Rate Limiting**
   - SMS sending is rate-limited per user
   - Max 5 OTP requests per phone per hour
   - Max 3 password reset requests per email per hour

5. **Log Sensitive Operations**
   ```typescript
   // Server logs (never exposed to client):
   [TextSMS] Sending SMS to: +254712345678
   [TextSMS] Response: Message queued - ID: txn_12345
   ```

## Cost Estimation

Typical TextSMS pricing (Check current rates):
- **Domestic SMS**: KES 1-2 per message
- **International SMS**: KES 5-10 per message
- **Volume discounts**: Available for 1000+ messages/month

Example monthly cost (1000 users):
- Password resets: 100 × 2 SMS = 200 SMS → ~KES 200-400
- Phone verifications: 50 × 1 SMS = 50 SMS → ~KES 50-100
- **Monthly estimate**: KES 250-500

## Support & Resources

### TextSMS Support

- **Website**: https://textsms.co.ke/
- **Email**: support@textsms.co.ke
- **Phone**: +254 (check website)
- **Portal**: https://portal.textsms.co.ke/

### API Documentation

- **TextSMS API Docs**: https://textsms.co.ke/api-documentation
- **Your Dashboard**: https://portal.textsms.co.ke/ → Docs/API

### Our Code

- **Service**: `backend/src/integrations/textsms.ts`
- **Auth Integration**: `backend/src/modules/auth/auth.service.ts`
- **Config**: `backend/src/config/index.ts`

## Testing

### Local Testing

1. Add real credentials to `.env`
2. Test endpoints via curl or Postman:
   ```bash
   # Test password reset
   curl -X POST http://localhost:4000/api/auth/password/forgot \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```
3. Monitor logs for TextSMS API calls
4. Check your phone for SMS

### Without Real Credits

If testing without spending credits:
1. Use TextSMS **Sandbox/Test Mode** (if available)
2. Check TextSMS portal for test API key
3. Use special test numbers like `+254700000000`

## Migration from Email-Only

If you previously only used email:

1. **Current**: Email only
   ```
   forgotPassword → Email with reset link
   ```

2. **After TextSMS**: Email + SMS
   ```
   forgotPassword → Email + SMS (if phone exists)
               → Email only (if no phone)
   ```

3. **No code changes needed** - The service automatically sends both

## Next Steps

1. ✅ Create TextSMS account on https://textsms.co.ke/
2. ✅ Get API credentials from portal
3. ✅ Add credentials to `.env` file
4. ✅ Restart backend server
5. ✅ Test with sample request
6. ✅ Monitor SMS delivery in TextSMS portal

## FAQ

**Q: Can I use TextSMS for other messages (promotions, reminders)?**
A: Yes, but you need additional API endpoints. Use `textsmsService.sendOtp()` as template.

**Q: What if user has no phone number?**
A: System sends email only. SMS is optional.

**Q: Can I customize SMS content?**
A: Yes, edit templates in `textsms.ts` under `sendPasswordResetCode()` method.

**Q: Is there a rate limit?**
A: Yes - 5 OTP requests per phone per hour, 3 resets per email per hour.

**Q: Can I use multiple TextSMS accounts?**
A: Yes, rotate API keys in .env, but one account per environment recommended.
