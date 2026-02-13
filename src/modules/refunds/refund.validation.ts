import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createRefundSchema = z.object({
  bookingId: z.string().uuid(),
  paymentId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  reason: z.string().min(3),
  reference: z.string().min(3).optional(),
});

export const updateRefundSchema = z.object({
  status: z.enum([
    "REQUESTED",
    "APPROVED",
    "DECLINED",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
  ]).optional(),
  reference: z.string().min(3).optional(),
  processedAt: z.coerce.date().optional(),
  transitionReason: z.string().min(2).optional(),
});

export const listRefundSchema = paginationSchema.merge(
  z.object({
    bookingId: z.string().uuid().optional(),
    paymentId: z.string().uuid().optional(),
  })
);

export const refundIdSchema = z.object({
  id: z.string().uuid(),
});
