import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const bookingPartnerSchema = z.object({
  partnerId: z.string().uuid(),
  partnerName: z.string().min(2),
  partnerPhoneNumber: z.string().optional(),
  description: z.string().optional(),
  costAtBooking: z.number().min(0),
  costPostEvent: z.number().min(0),
});

export const createBookingSchema = z.object({
  customerName: z.string().min(2),
  customerPhoneNumber: z.string().optional(),
  serviceTitle: z.string().min(2),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]).optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PARTIAL", "PAID"]).optional(),
  paymentType: z.enum(["FULL_PAYMENT", "PARTIAL_PAYMENT"]).optional(),
  costAtBooking: z.number().min(0).optional(),
  costPostEvent: z.number().min(0).optional(),
  payPostEventDueDate: z.coerce.date().optional(),
  agentId: z.string().uuid().optional(),
  serviceStartAt: z.coerce.date().optional(),
  serviceEndAt: z.coerce.date().optional(),
  serviceTimezone: z.string().min(3).optional(),
  bookingPartners: z.array(bookingPartnerSchema).min(1).optional(),
  splitPaymentEnabled: z.boolean().optional(),
  depositPercentage: z.number().min(0.1).max(1).optional(),
  depositAmount: z.number().positive().optional(),
  depositDueDate: z.coerce.date().optional(),
  balanceDueDate: z.coerce.date().optional(),
  splitPaymentNotes: z.string().max(1000).optional(),
}).refine(
  (data) => {
    // If split payment is enabled, check date logic
    if (data.splitPaymentEnabled && data.depositDueDate && data.balanceDueDate) {
      return data.balanceDueDate > data.depositDueDate;
    }
    return true;
  },
  {
    message: "Balance due date must be after deposit due date",
    path: ["balanceDueDate"],
  }
).refine(
  (data) => {
    // If service dates are provided, check they make sense
    if (data.serviceStartAt && data.serviceEndAt) {
      return data.serviceEndAt > data.serviceStartAt;
    }
    return true;
  },
  {
    message: "Service end date must be after service start date",
    path: ["serviceEndAt"],
  }
);

export const updateBookingSchema = z.object({
  customerName: z.string().min(2).optional(),
  customerPhoneNumber: z.string().optional(),
  serviceTitle: z.string().min(2).optional(),
  amount: z.number().positive().optional(),
  currency: z.enum(["USD", "KES"]).optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PARTIAL", "PAID"]).optional(),
  paymentType: z.enum(["FULL_PAYMENT", "PARTIAL_PAYMENT"]).optional(),
  costAtBooking: z.number().min(0).optional(),
  costPostEvent: z.number().min(0).optional(),
  payPostEventDueDate: z.coerce.date().optional(),
  agentId: z.string().uuid().optional(),
  serviceStartAt: z.coerce.date().optional(),
  serviceEndAt: z.coerce.date().optional(),
  serviceTimezone: z.string().min(3).optional(),
  transitionReason: z.string().min(2).optional(),
  bookingPartners: z.array(bookingPartnerSchema).optional(),
  splitPaymentEnabled: z.boolean().optional(),
  depositPercentage: z.number().min(0.1).max(1).optional(),
  depositAmount: z.number().positive().optional(),
  depositDueDate: z.coerce.date().optional(),
  balanceDueDate: z.coerce.date().optional(),
  splitPaymentNotes: z.string().max(1000).optional(),
}).refine(
  (data) => {
    // If split payment is enabled, check date logic
    if (data.splitPaymentEnabled && data.depositDueDate && data.balanceDueDate) {
      return data.balanceDueDate > data.depositDueDate;
    }
    return true;
  },
  {
    message: "Balance due date must be after deposit due date",
    path: ["balanceDueDate"],
  }
).refine(
  (data) => {
    // If service dates are provided, check they make sense
    if (data.serviceStartAt && data.serviceEndAt) {
      return data.serviceEndAt > data.serviceStartAt;
    }
    return true;
  },
  {
    message: "Service end date must be after service start date",
    path: ["serviceEndAt"],
  }
);

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
