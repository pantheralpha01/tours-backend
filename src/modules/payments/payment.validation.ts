import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  provider: z.enum(["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD"]),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  reference: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updatePaymentSchema = z.object({
  state: z.enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
  reference: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
  transitionReason: z.string().min(2).optional(),
});

export const paymentIdSchema = z.object({
  id: z.string().uuid(),
});
