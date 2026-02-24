import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const shiftStatusEnum = z.enum([
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

const ensureChronology = <T extends { startAt?: Date; endAt?: Date }>(
  schema: z.ZodType<T>
) =>
  schema.superRefine((data, ctx) => {
    if (data.startAt && data.endAt && data.endAt <= data.startAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endAt must be after startAt",
        path: ["endAt"],
      });
    }
  });

export const createShiftSchema = ensureChronology(
  z.object({
    agentId: z.string().uuid().optional(),
    bookingId: z.string().uuid().optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    status: shiftStatusEnum.optional(),
    notes: z.string().max(1000).optional(),
  })
);

export const updateShiftSchema = ensureChronology(
  z.object({
    agentId: z.string().uuid().optional(),
    bookingId: z.string().uuid().optional().nullable(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    status: shiftStatusEnum.optional(),
    notes: z.string().max(1000).optional().nullable(),
  })
);

export const shiftIdSchema = z.object({
  id: z.string().uuid(),
});

export const listShiftSchema = paginationSchema.extend({
  agentId: z.string().uuid().optional(),
  startFrom: z.coerce.date().optional(),
  startTo: z.coerce.date().optional(),
  status: shiftStatusEnum.optional(),
  bookingId: z.string().uuid().optional(),
});
