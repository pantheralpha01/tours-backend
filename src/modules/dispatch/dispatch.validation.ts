import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createDispatchSchema = z.object({
  bookingId: z.string().uuid(),
  assignedToId: z.string().uuid().optional(),
  status: z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().min(2).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
});

export const updateDispatchSchema = z.object({
  assignedToId: z.string().uuid().optional(),
  status: z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().min(2).optional(),
  startedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  transitionReason: z.string().min(2).optional(),
});

export const dispatchIdSchema = z.object({
  id: z.string().uuid(),
});

export const listDispatchSchema = paginationSchema.merge(
  z.object({
    status: z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    assignedToId: z.string().uuid().optional(),
    bookingId: z.string().uuid().optional(),
  })
);

export const createTrackPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  recordedAt: z.coerce.date().optional(),
  metadata: z.record(z.any()).optional(),
});
