# Stripe Payment Gateway API Reference

## Quick API Reference for Backend Developers

### Available Methods in `paymentGatewayService`

#### 1. Create Payment Intent
```typescript
import { paymentGatewayService } from "../../integrations/payment-gateway";

const result = await paymentGatewayService.createIntent({
  provider: "STRIPE",
  amount: 1500,           // Amount in USD/KES
  currency: "USD",        // USD or KES
  reference: "BOOKING_123",
  metadata: {
    bookingId: "uuid",
    customerId: "uuid"
  }
});

// Returns:
// {
//   provider: "STRIPE",
//   amount: 1500,
//   currency: "USD",
//   reference: "BOOKING_123",
//   status: "requires_payment_method",
//   clientSecret: "pi_xxx_secret_xxx",
//   paymentIntentId: "pi_xxx"
// }
```

#### 2. Get Payment Status
```typescript
const result = await paymentGatewayService.getPaymentStatus({
  provider: "STRIPE",
  paymentIntentId: "pi_xxx"
});

// Returns:
// {
//   provider: "STRIPE",
//   status: "succeeded" | "processing" | "requires_action" | etc,
//   amount: 1500,
//   amountCaptured: 1500,
//   clientSecret: "pi_xxx_secret_xxx",
//   lastPaymentError: "Card declined" | null
// }
```

#### 3. Confirm Payment
```typescript
const result = await paymentGatewayService.confirmPayment({
  provider: "STRIPE",
  paymentIntentId: "pi_xxx",
  paymentMethodId: "pm_xxx"
});

// Returns:
// {
//   provider: "STRIPE",
//   status: "succeeded" | "processing" | "requires_action",
//   paymentIntentId: "pi_xxx",
//   clientSecret: "pi_xxx_secret_xxx"
// }
```

#### 4. Create Payment Method
```typescript
const result = await paymentGatewayService.createPaymentMethod({
  provider: "STRIPE",
  type: "card",
  cardDetails: {
    cardNumber: "4242424242424242",
    expMonth: 12,
    expYear: 2026,
    cvc: "123"
  }
});

// Returns:
// {
//   provider: "STRIPE",
//   paymentMethodId: "pm_xxx",
//   last4: "4242",
//   brand: "visa"
// }
```

#### 5. Refund Payment
```typescript
const result = await paymentGatewayService.refund({
  provider: "STRIPE",
  paymentIntentId: "pi_xxx",
  amount: 750      // Optional - if omitted, refunds full amount
});

// Returns:
// {
//   provider: "STRIPE",
//   refundId: "re_xxx",
//   status: "succeeded" | "pending" | "failed",
//   amount: 750
// }
```

#### 6. List Payment Methods
```typescript
const result = await paymentGatewayService.listPaymentMethods({
  provider: "STRIPE",
  customerId: "cus_xxx"
});

// Returns:
// {
//   provider: "STRIPE",
//   paymentMethods: [
//     {
//       id: "pm_xxx",
//       type: "card",
//       last4: "4242",
//       brand: "visa",
//       expMonth: 12,
//       expYear: 2026
//     }
//   ]
// }
```

#### 7. Delete Payment Method
```typescript
const result = await paymentGatewayService.deletePaymentMethod({
  provider: "STRIPE",
  paymentMethodId: "pm_xxx"
});

// Returns:
// {
//   provider: "STRIPE",
//   success: true
// }
```

## Integration Examples

### Creating a Payment in Payment Service

```typescript
// In booking.payment.service.ts
import { paymentGatewayService } from "../../integrations/payment-gateway";

export const paymentService = {
  initiateStripePayment: async (data: {
    bookingId: string;
    amount: number;
    currency: "USD" | "KES";
  }) => {
    // Create payment intent with Stripe
    const intentResult = await paymentGatewayService.createIntent({
      provider: "STRIPE",
      amount: data.amount,
      currency: data.currency,
      metadata: {
        bookingId: data.bookingId,
      }
    });

    // Store payment record in database
    const payment = await paymentRepository.create({
      bookingId: data.bookingId,
      provider: "STRIPE",
      amount: data.amount,
      currency: data.currency,
      reference: intentResult.reference,
      externalReference: intentResult.paymentIntentId,
      metadata: {
        clientSecret: intentResult.clientSecret,
        status: intentResult.status
      }
    });

    return {
      paymentId: payment.id,
      clientSecret: intentResult.clientSecret,
      amount: data.amount,
      currency: data.currency
    };
  }
};
```

### Processing Webhook Events

```typescript
// In payment.webhook-adapters.ts - already implemented
// The webhook adapter automatically extracts:
// - Payment Intent ID from Stripe event
// - Payment status (succeeded, failed, etc)
// - Amount and currency
// - Booking reference from metadata

// Webhook payload is normalized and passed to payment service
```

### Refunding a Payment

```typescript
import { paymentGatewayService } from "../../integrations/payment-gateway";

export const refundService = {
  refundPayment: async (data: {
    paymentId: string;
    amount?: number;
  }) => {
    // Get payment from database
    const payment = await paymentRepository.findById(data.paymentId);
    
    if (!payment || payment.provider !== "STRIPE") {
      throw ApiError.badRequest("Payment not found or not Stripe payment");
    }

    // Process refund through Stripe
    const refundResult = await paymentGatewayService.refund({
      provider: "STRIPE",
      paymentIntentId: payment.externalReference,
      amount: data.amount
    });

    // Update payment status
    await paymentRepository.update(data.paymentId, {
      state: "REFUNDED",
      metadata: {
        refundId: refundResult.refundId,
        refundStatus: refundResult.status
      }
    });

    return refundResult;
  }
};
```

## Error Handling

All methods throw `ApiError` for known issues:

```typescript
try {
  const result = await paymentGatewayService.createIntent({
    provider: "STRIPE",
    amount: 1500,
    currency: "USD"
  });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code);    // e.g., "PAYMENT_GATEWAY_NOT_CONFIGURED"
    console.error(error.message); // e.g., "STRIPE gateway is not configured"
    console.error(error.statusCode); // 400
  }
}
```

## Stripe Object Types

```typescript
// Payment Intent Status
type PaymentIntentStatus = 
  | "succeeded"
  | "processing"
  | "requires_action"
  | "requires_capture"
  | "requires_confirmation"
  | "requires_payment_method"
  | "canceled";

// Payment Method Type
type PaymentMethodType = 
  | "card"
  | "bank_account"
  | "wallet"
  | "after_dark";

// Card Brand
type CardBrand = 
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "diners"
  | "jcb";
```

## Testing Payments

### Test Cards

```typescript
// Success
4242424242424242

// Decline - insufficient funds
4000000000009995

// 3D Secure required
4000002500003155

// Mastercard (success)
5555555555554444

// Amex (success)
378282246310005
```

### Testing with Stripe CLI

```bash
# Listen for events
stripe listen --forward-to localhost:4000/api/payments/webhooks/STRIPE

# Trigger test event
stripe trigger payment_intent.succeeded
stripe trigger charge.refunded

# View events
stripe events list
```

## Configuration Requirements

For Stripe to work, you must have in `.env`:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Public key for frontend
STRIPE_SECRET_KEY=sk_live_xxxxx       # Secret key for backend
STRIPE_WEBHOOK_SECRET=whsec_xxxxx     # Webhook signing secret
```

Without all three, `paymentGatewayService` will throw:
- `"STRIPE gateway is not configured"` error

## Rate Limits

Stripe API has rate limits:
- **Read operations**: 100 requests/second
- **Write operations**: 100 requests/second
- **UI operations**: 10 requests/second

The booking system includes rate limiting middleware that respects these limits.

