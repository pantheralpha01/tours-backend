# Postman Comprehensive State Machine Tests

This directory contains a complete Postman collection that mirrors your bash test script with all 24 test scenarios.

## 📁 Files Created

1. **`Comprehensive_State_Machine_Tests.postman_collection.json`** - Main collection with all 24 tests
2. **`Comprehensive_Tests_Environment.postman_environment.json`** - Environment variables setup

## 🚀 Quick Setup (5 minutes)

### Step 1: Import Collection
1. Open Postman
2. Click **Import** (top left)
3. Drag & drop `Comprehensive_State_Machine_Tests.postman_collection.json`
4. Click **Import**

### Step 2: Import Environment
1. In Postman, click **Environments** (left sidebar)
2. Click **Import** 
3. Drag & drop `Comprehensive_Tests_Environment.postman_environment.json`
4. Click **Import**
5. **Select the environment** from dropdown (top right)

### Step 3: Start Your Server
```bash
# Make sure your server is running
cd C:\Users\Acer\Desktop\tours\backend
npm run dev
```

### Step 4: Run Tests
**Option A: Run Individual Tests**
- Click any request and hit **Send**
- Tests run automatically and variables are set

**Option B: Run All Tests (Recommended)**
1. Right-click collection → **Run collection**
2. Click **Run Comprehensive State Machine Tests**
3. Watch all 24 tests execute sequentially!

## ✨ Features

### 🔄 **Automatic Variable Management**
- Login automatically stores JWT token
- Each creation request stores IDs for next requests
- No manual copying/pasting needed!

### 🧪 **Comprehensive Test Assertions**
- HTTP status code validation
- Response structure validation  
- State transition verification
- Invalid transition rejection testing

### 📊 **Rich Test Output**
- ✓ Green checkmarks for passing tests
- ❌ Clear error messages for failures
- Console logs with detailed information
- Final success summary

### 🎯 **Exact Bash Script Mirror**
Every request matches your working bash script:
- Same endpoints and methods
- Same request bodies
- Same test scenarios and assertions
- Same business logic validation

## 🎮 Test Scenarios Covered

**Authentication & Setup:**
1. Login (stores JWT token)

**Core Lifecycle Workflows:**
2-6. **Payment Workflow**: Create → INITIATED → PENDING → COMPLETED
7-8. **Booking Workflow**: DRAFT → CONFIRMED (after payment complete)
9-12. **Dispatch Workflow**: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
13-15. **Dispute Workflow**: OPEN → UNDER_REVIEW → RESOLVED
16-19. **Refund Workflow**: REQUESTED → APPROVED → PROCESSING → COMPLETED

**Validation Testing:**
20. Invalid transition testing (CONFIRMED → DRAFT should fail)

**CRUD Validation:**
21-24. Get details for all created entities
25. List all bookings

## 🎉 Expected Results

When all tests pass, you'll see:
```
✓ 24/24 tests passing
🎉 ALL STATE MACHINE APIS WORKING PERFECTLY!
✅ All transitions validated successfully  
✅ All CRUD operations working
✅ State machine rules enforced correctly
✅ Invalid transitions properly rejected
```

## 🛠 Troubleshooting

**Server Not Running:**
- Make sure `npm run dev` is running on port 4000
- Check `base_url` in environment matches your server

**Authentication Issues:**
- Run Test 1 (Login) first to get fresh JWT token
- Token expires after 15 minutes - re-run login if needed

**Test Failures:**
- Check server logs for detailed error messages
- Verify database is properly seeded with admin user
- Ensure previous tests completed successfully (dependencies)

## 🔧 Customization

**Change Server URL:**
Edit `base_url` in environment: `http://localhost:4000` → your URL

**Different Login Credentials:**
Edit Test 1 request body to use your admin credentials

**Add More Tests:**
Follow existing pattern - each test has assertions in the **Tests** tab

## 🚀 Advantages Over Bash Script

✅ **Better UI**: Visual request/response inspection
✅ **Debugging**: Easy to inspect headers, body, status codes
✅ **Sharing**: Export/import collections with team
✅ **History**: See previous request results
✅ **Collections**: Organize related requests
✅ **Environments**: Switch between dev/staging/prod easily

Your comprehensive bash script was excellent - now you have the same power in Postman's rich testing environment!