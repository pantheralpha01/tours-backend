import { z } from "zod";

export const escrowReleaseSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).default("USD"),
  notes: z.string().max(1000).optional(),
  releaseAt: z.coerce.date().optional(),
});

export const bookingParamSchema = z.object({
  bookingId: z.string().uuid(),
});

export const payoutParamSchema = z.object({
  bookingId: z.string().uuid(),
  payoutId: z.string().uuid(),
});

export const payoutStatusSchema = z.object({
  status: z.enum(["APPROVED", "SENT", "CANCELLED"]),
  transactionReference: z.string().max(191).optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
});
