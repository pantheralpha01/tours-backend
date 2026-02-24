import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const createBookingSchema = z.object({
  customerName: z.string().min(2),
  serviceTitle: z.string().min(2),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID"]).optional(),
  agentId: z.string().uuid().optional(),
  serviceStartAt: z.coerce.date().optional(),
  serviceEndAt: z.coerce.date().optional(),
  serviceTimezone: z.string().min(3).optional(),
  splitPaymentEnabled: z.boolean().optional(),
  depositPercentage: z.number().min(0.1).max(1).optional(),
  depositAmount: z.number().positive().optional(),
  depositDueDate: z.coerce.date().optional(),
  balanceDueDate: z.coerce.date().optional(),
  splitPaymentNotes: z.string().max(1000).optional(),
});

export const updateBookingSchema = z.object({
  customerName: z.string().min(2).optional(),
  serviceTitle: z.string().min(2).optional(),
  amount: z.number().positive().optional(),
  currency: z.enum(["USD", "KES"]).optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID"]).optional(),
  agentId: z.string().uuid().optional(),
  serviceStartAt: z.coerce.date().optional(),
  serviceEndAt: z.coerce.date().optional(),
  serviceTimezone: z.string().min(3).optional(),
  transitionReason: z.string().min(2).optional(),
  splitPaymentEnabled: z.boolean().optional(),
  depositPercentage: z.number().min(0.1).max(1).optional(),
  depositAmount: z.number().positive().optional(),
  depositDueDate: z.coerce.date().optional(),
  balanceDueDate: z.coerce.date().optional(),
  splitPaymentNotes: z.string().max(1000).optional(),
});

export const transitionBookingSchema = z.object({
  toStatus: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]),
  transitionReason: z.string().min(2).optional(),
});

export const bookingIdSchema = z.object({
  id: z.string().uuid(),
});

export const listBookingSchema = paginationSchema
  .merge(
    z.object({
      serviceStartFrom: z.coerce.date().optional(),
      serviceStartTo: z.coerce.date().optional(),
    })
  )
  .extend({
    search: z.string().optional(),
  });

export const calendarBookingSchema = paginationSchema.merge(
  z.object({
    serviceStartFrom: z.coerce.date().optional(),
    serviceStartTo: z.coerce.date().optional(),
  })
);
