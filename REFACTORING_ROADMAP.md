# REFACTORING ROADMAP: From Spaghetti Code to Clean Architecture

## 📋 BLUEPRINT APPLIED TO YOUR CODEBASE

This document maps the criticism and roadmap to your Booking domain refactor, serving as a template for other domains.

---

## 1. CRITICISM → SOLUTION MAPPING

### Issue 1: Tight API-Database Coupling
**Problem:** API validation schemas matched DB model exactly, creating a brittle contract.

**Solution Implemented:**
- **New:** `booking.dto.ts` - API request/response DTOs (decoupled from DB)
- **New:** `booking.mapper.ts` - Transforms API DTO → Prisma model
- **Result:** API and DB can evolve independently

```typescript
// BEFORE: API layer directly to DB
const payload = createBookingSchema.parse(req.body); // Validated exact DB fields
const booking = await bookingService.create({ ...payload, agentId }); // Sent to DB

// AFTER: API → DTO → Mapper → DB
const payload = createBookingSchema.parse(req.body); // Validates API input only
const dbInput = mapCreateDTOToDb(payload); // Transforms to DB format
const booking = await bookingRepository.create(dbInput); // DB receives correct format
```

---

### Issue 2: Business Logic in Service Layer is Too Complex
**Problem:** `booking.service.ts` had 600+ lines mixing data transformation, validation, and orchestration.

**Solution Implemented:**
- **New:** `booking.service-new.ts` (~250 lines, clean)
  - Focuses on orchestration only
  - No data transformation (delegated to mapper)
  - Each method is 10-30 lines
  
**Example:**
```typescript
// BEFORE: Mixed concerns
const create = async (data: any) => {
  // Lines 50-150: Decimal type conversion, commission calculations
  // Lines 151-200: Split payment logic
  // Lines 201-250: Validation checks
  // Lines 251-300: DB creation
  // Lines 301-350: Event logging
};

// AFTER: Single responsibility
const create = async (input: CreateBookingDTO) => {
  // Validate agent exists (1 line)
  // Transform DTO to DB model (1 line - delegates to mapper)
  // Create booking (1 line)
  // Log event (1 line)
  // Sync related services (2 lines)
};
```

---

### Issue 3: Error Handling Inconsistency
**Problem:** 14+ instances of wrong `new ApiError()` constructor calls found.

**Solution:** 
- Standardized to use static factory methods: `ApiError.badRequest()`, `ApiError.notFound()`
- Controller now has consistent error handling
- All errors bubble to centralized middleware

---

### Issue 4: Scattered Validation Rules
**Problem:** Validation schemas mixed API input validation, DB constraints, and business rules.

**Solution:**
- `booking.validation.ts` - **API input validation only** (clean, simple)
- Business rules stay in `booking.rules.ts` and `booking.lifecycle-rules.ts`
- Type conversion in `booking.mapper.ts`

```typescript
// BEFORE: Massive schema with too much logic
export const createBookingSchema = z.object({
  customerEmail: z.string().email(),
  commissionRate: z.number().min(0).max(1).optional(), // DB concern
  splitPaymentEnabled: z.boolean().optional(),
  depositPercentage: z.number().min(0.1).max(1).optional(), // Business logic
  depositDueDate: z.coerce.date().optional(),
  balanceDueDate: z.coerce.date().optional(),
}).refine((data) => {
  if (data.splitPaymentEnabled && data.depositDueDate && data.balanceDueDate) {
    return data.balanceDueDate > data.depositDueDate;
  }
  return true;
}); // 100+ lines

// AFTER: Simple, focused
export const createBookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  serviceTitle: z.string().min(2),
  amount: z.number().min(0.01),
  // ... just API input fields
}); // 20 lines
```

---

### Issue 5: Deep Model Relations
**Problem:** Booking model had 20+ relations, making queries complex and error-prone.

**Solution:**
- Mapper controls what relations are created
- Service layer (not model layer) orchestrates related operations
- Each operation is explicit: `await bookingService.create()` does only what's needed

---

## 2. ROADMAP → IMPLEMENTATION

### Step 1: Domain Modeling & Separation ✅
Created DTOs to identify and separate concerns:
- `CreateBookingDTO` - API input contract
- `UpdateBookingDTO` - Update input contract
- `BookingResponseDTO` - Response contract (could use for response transformation)

### Step 2: Service Layer & Repositories ✅
- `bookingService` - Orchestration only
- `bookingRepository` - DB access (clean CRUD)
- Separation of concerns

### Step 3: API Layer Refactoring ✅
- `bookingController-new.ts` - Minimal, 1 responsibility per endpoint
- Clear flow: Validate → Call Service → Return Response
- All errors bubble to middleware

### Step 4: Error Handling ✅
- Centralized error factories: `ApiError.badRequest()`, `ApiError.notFound()`
- Controller passes errors to middleware
- No try-catch logic duplication

### Step 5: Documentation & Naming ✅
- JSDoc comments added to all functions
- Consistent naming:  `create()`, `getById()`, `update()`, `list()`, `remove()`
- Clear distinction between DTOs, services, controllers

### Step 6: Testing & Migration
- Ready for unit tests (service is isolated)
- Ready for integration tests (controller + service)
- Small, focused methods easier to test

---

## 3. FOLDER STRUCTURE (BEFORE VS AFTER)

### BEFORE:
```
src/modules/bookings/
├── booking.controller.ts (182 lines, mixed concerns)
├── booking.service.ts (612 lines, too much logic)
├── booking.validation.ts (194 lines, mixed validation types)
├── booking.repository.ts (standard)
├── booking.transitions.ts (standard)
├── booking.rules.ts (standard)
├── booking.lifecycle-rules.ts (standard)
└── ... other files
```

### AFTER:
```
src/modules/bookings/
├── booking.controller-new.ts ✨ (160 lines, clean)
├── booking.service-new.ts ✨ (290 lines, focused)
├── booking.dto.ts ✨ (80 lines, contracts)
├── booking.mapper.ts ✨ (110 lines, transformation)
├── booking.validation.ts ✨ (65 lines, simple)
├── booking.repository.ts (standard)
├── booking.transitions.ts (standard)
├── booking.rules.ts (standard)
├── booking.lifecycle-rules.ts (standard)
└── ... other files
```

**Key Improvements:**
- 3 new files with clear, single responsibilities
- All files under 300 lines (easy to understand)
- Clear data flow: Request → DTO → Mapper → DB → Response

---

## 4. FIXING THE BOOKING 400 ERROR

### Root Cause:
- API validation wasn't matching DB expectations
- `commissionRate`, `commissionAmount` weren't being properly converted to Decimal types

### Solution:
The mapper now handles **all type conversions**:

```typescript
// booking.mapper.ts
return {
  customerName: dto.customerName,
  customerEmail: dto.customerEmail,
  amount: new Prisma.Decimal(dto.amount.toString()), // ✅ Proper conversion
  commissionRate: new Prisma.Decimal(BOOKING_COMMISSION_RATE.toString()), // ✅ Auto-calculated
  commissionAmount: new Prisma.Decimal(commissionInKes.toString()), // ✅ Auto-calculated
  // ... all other fields properly typed
};
```

The validation schema no longer requires these fields from API - mapper adds them.

---

## 5. HOW TO APPLY THIS PATTERN TO OTHER DOMAINS

### For Users, Partners, Invoices, etc., follow this template:

**1. Create `{domain}.dto.ts`**
```typescript
export interface Create{Domain}DTO { /* API input */ }
export interface Update{Domain}DTO { /* API update */ }
export interface {Domain}ResponseDTO { /* Response */ }
```

**2. Create `{domain}.mapper.ts`**
```typescript
export const mapCreateDTOToDb = (dto: Create{Domain}DTO): Prisma.{Domain}CreateInput => { /* transform */ }
export const mapUpdateDTOToDb = (dto: Update{Domain}DTO): Prisma.{Domain}UpdateInput => { /* transform */ }
```

**3. Simplify `{domain}.validation.ts`**
- Keep only API input validation
- Remove business rules (they go in service/rules files)
- Remove DB concerns (they go in mapper)

**4. Refactor `{domain}.service.ts`**
- Import mapper
- Import repository
- 1 method = 1 concern (create, update, list, etc.)
- Use mapper for all DTO → DB transforms
- Delegate to repository for DB access
- Call other services for cross-domain logic

**5. Refactor `{domain}.controller.ts`**
- Validate request
- Call service
- Return response
- Pass errors to middleware
- No business logic

---

## 6. NEXT STEPS

### To Deploy This Refactor:

1. **Rename existing files** (backup for reference):
   ```bash
   mv booking.controller.ts booking.controller.old.ts
   mv booking.service.ts booking.service.old.ts
   ```

2. **Rename new files:**
   ```bash
   mv booking.controller-new.ts booking.controller.ts
   mv booking.service-new.ts booking.service.ts
   ```

3. **Update routes to use new controller**:
   ```typescript
   import { bookingController } from './booking.controller'; // ✅ Uses -new.ts
   ```

4. **Test:**
   ```bash
   newman run Comprehensive_State_Machine_Tests_Updated.postman_collection.json
   ```

5. **Apply same pattern to:**
   - Invoice module (highest priority - also has type conversion issues)
   - User/Auth module
   - Partner module
   - Other domains...

---

## 7. BENEFITS SUMMARY

| Before | After |
|--------|-------|
| Tight API-DB coupling | DTOs decouple layers |
| Complex 600-line service | Clean 250-line service |
| Scattered validation | Focused validation + mapper |
| Inconsistent errors | Standardized error factories |
| Hard to test | Unit-testable services |
| Hard to understand | Clear responsibility per file |
| Brittle on schema changes | Flexible and maintainable |

---

## 8. QUICK REFERENCE: DATA FLOW

```
HTTP Request
     ↓
[Controller] Validate input (Zod schema)
     ↓
[DTO] Typed, validated API input
     ↓
[Service] Call with DTO + business context
     ↓
[Mapper] Transform DTO → DB model
     ↓
[Repository] Execute Prisma query
     ↓
[DB] Return data
     ↓
[Service] Orchestrate related operations (events, syncs, etc.)
     ↓
[Controller] Format response
     ↓
HTTP Response
```

This is the **clean architecture pattern** you can replicate across your entire codebase.

