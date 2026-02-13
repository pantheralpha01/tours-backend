import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createDisputeSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(3),
  description: z.string().min(3).optional(),
  assignedToId: z.string().uuid().optional(),
});

export const updateDisputeSchema = z.object({
  status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]).optional(),
  reason: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  assignedToId: z.string().uuid().optional(),
  resolvedAt: z.coerce.date().optional(),
  transitionReason: z.string().min(2).optional(),
});

export const listDisputeSchema = paginationSchema.merge(
  z.object({
    bookingId: z.string().uuid().optional(),
    openedById: z.string().uuid().optional(),
    assignedToId: z.string().uuid().optional(),
  })
);

export const disputeIdSchema = z.object({
  id: z.string().uuid(),
});
