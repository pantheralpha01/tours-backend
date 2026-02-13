import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createQuoteSchema = z.object({
  bookingId: z.string().uuid(),
  title: z.string().min(2),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  expiresAt: z.coerce.date().optional(),
  items: z.record(z.any()).optional(),
  notes: z.string().min(2).optional(),
  agentId: z.string().uuid().optional(),
});

export const updateQuoteSchema = z.object({
  title: z.string().min(2).optional(),
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
  amount: z.number().positive().optional(),
  currency: z.enum(["USD", "KES"]).optional(),
  expiresAt: z.coerce.date().optional(),
  items: z.record(z.any()).optional(),
  notes: z.string().min(2).optional(),
});

export const listQuoteSchema = paginationSchema.merge(
  z.object({
    bookingId: z.string().uuid().optional(),
    agentId: z.string().uuid().optional(),
  })
);

export const quoteIdSchema = z.object({
  id: z.string().uuid(),
});
