import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createPartnerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  isActive: z.boolean().optional(),
});

export const updatePartnerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  isActive: z.boolean().optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  rejectedReason: z.string().min(3).optional(),
});

export const listPartnerSchema = paginationSchema.merge(
  z.object({
    approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    createdById: z.string().uuid().optional(),
  })
);

export const partnerIdSchema = z.object({
  id: z.string().uuid(),
});

export const rejectPartnerSchema = z.object({
  reason: z.string().min(3).optional(),
});
