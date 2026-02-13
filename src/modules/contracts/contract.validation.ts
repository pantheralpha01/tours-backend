import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createContractSchema = z.object({
  bookingId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
  status: z.enum(["DRAFT", "SENT", "SIGNED", "CANCELLED"]).optional(),
  fileUrl: z.string().min(5).optional(),
  signedAt: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateContractSchema = z.object({
  partnerId: z.string().uuid().optional(),
  status: z.enum(["DRAFT", "SENT", "SIGNED", "CANCELLED"]).optional(),
  fileUrl: z.string().min(5).optional(),
  signedAt: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listContractSchema = paginationSchema.merge(
  z.object({
    bookingId: z.string().uuid().optional(),
    partnerId: z.string().uuid().optional(),
  })
);

export const contractIdSchema = z.object({
  id: z.string().uuid(),
});
