import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createReceiptSchema = z.object({
  bookingId: z.string().uuid(),
  paymentId: z.string().uuid(),
  receiptNumber: z.string().min(3),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  status: z.enum(["ISSUED", "VOID"]).optional(),
  issuedAt: z.coerce.date().optional(),
  fileUrl: z.string().min(5).optional(),
});

export const updateReceiptSchema = z.object({
  status: z.enum(["ISSUED", "VOID"]).optional(),
  fileUrl: z.string().min(5).optional(),
});

export const listReceiptSchema = paginationSchema.merge(
  z.object({
    bookingId: z.string().uuid().optional(),
    paymentId: z.string().uuid().optional(),
  })
);

export const receiptIdSchema = z.object({
  id: z.string().uuid(),
});
