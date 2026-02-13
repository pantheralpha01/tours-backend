# 🔧 QUICK FIX: Postman Authentication Issue

## The Problem 
Getting 401 errors after login because JWT token isn't being used properly in subsequent requests.

## 🚀 QUICK FIX (2 minutes)

### Step 1: Check Token Storage
1. Run **"1. Login"** request first
2. Check the **Console** (bottom panel) - you should see:
   ```
   ✓ Login - Token stored: eyJhbGciOiJIUzI1NiIs...
   ```
3. Go to **Environment tab** → verify `access_token` has a value

### Step 2: Fix Request Authorization  
**For each request after login:**

1. Click the request (e.g., "2. Create Booking")
2. Go to **Authorization** tab  
3. Select **"Inherit auth from parent"**
4. **OR** Select **"Bearer Token"** and enter `{{access_token}}`

### Step 3: Alternative - Quick Header Fix
**Or add Authorization header manually:**

1. Click request → **Headers** tab
2. Add header:
   - **Key**: `Authorization`  
   - **Value**: `Bearer {{access_token}}`

## 🎯 Test the Fix

1. Run **"1. Login"** first
2. Then run **"2. Create Booking"**  
3. Should get **201 Created** instead of **401 Unauthorized**

## 🔍 If Still Having Issues

**Check your server logs during the booking request:**

```bash
# In your server terminal, you should see:
::1 - - [13/Feb/2026:11:00:00 +0000] "POST /api/bookings HTTP/1.1" 201 410 "-" "PostmanRuntime/7.26.8"

# NOT:
::1 - - [13/Feb/2026:11:00:00 +0000] "POST /api/bookings HTTP/1.1" 401 65 "-" "PostmanRuntime/7.26.8"
```

**Debug the login response:**
1. Run Login request
2. Check Response body - should contain `accessToken`
3. If different format, let me know the exact response structure

## ✅ Once Fixed

Your tests will show:
```
✓ Status code is 201
✓ Response has booking ID  
✓ Booking status is DRAFT
```

This auth fix will resolve all the 401 errors! 🎉