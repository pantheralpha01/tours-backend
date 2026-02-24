import { z } from "zod";

export const paymentProviderEnum = z.enum([
  "MPESA",
  "STRIPE",
  "PAYPAL",
  "VISA",
  "MASTERCARD",
  "CRYPTO",
]);

export const manualProviderEnum = z.enum([
  "CASH",
  "BANK_TRANSFER",
  "MPESA",
  "PAYPAL",
  "VISA",
  "MASTERCARD",
  "CRYPTO",
  "OTHER",
]);

const basePaymentSchema = {
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  reference: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
};

export const createPaymentSchema = z.object({
  ...basePaymentSchema,
  provider: paymentProviderEnum,
});

export const initiatePaymentSchema = z.object({
  ...basePaymentSchema,
  provider: paymentProviderEnum,
});

export const manualPaymentSchema = z.object({
  ...basePaymentSchema,
  provider: manualProviderEnum.optional().default("CASH"),
  notes: z.string().max(1000).optional(),
  recordedAt: z.coerce.date().optional(),
});

export const updatePaymentSchema = z.object({
  state: z
    .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
    .optional(),
  reference: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
  transitionReason: z.string().min(2).optional(),
});

export const paymentIdSchema = z.object({
  id: z.string().uuid(),
});

export const webhookProviderParamSchema = z.object({
  provider: paymentProviderEnum,
});

export const paymentWebhookSchema = z.object({
  reference: z.string().min(3),
  status: z.string().min(2),
  amount: z.number().positive().optional(),
  currency: z.enum(["USD", "KES"]).optional(),
  eventType: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  eventId: z.string().min(3).optional(),
  reason: z.string().optional(),
});
