"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarBookingSchema = exports.listBookingSchema = exports.bookingIdSchema = exports.transitionBookingSchema = exports.updateBookingSchema = exports.createBookingSchema = exports.bookingPartnerSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.bookingPartnerSchema = zod_1.z.object({
    partnerId: zod_1.z.string().uuid(),
    partnerName: zod_1.z.string().min(2),
    partnerPhoneNumber: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    costAtBooking: zod_1.z.number().min(0),
    costPostEvent: zod_1.z.number().min(0),
});
exports.createBookingSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2),
    customerPhoneNumber: zod_1.z.string().optional(),
    serviceTitle: zod_1.z.string().min(2),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    status: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
    paymentStatus: zod_1.z.enum(["UNPAID", "PARTIAL", "PAID"]).optional(),
    paymentType: zod_1.z.enum(["FULL_PAYMENT", "PARTIAL_PAYMENT"]).optional(),
    costAtBooking: zod_1.z.number().min(0).optional(),
    costPostEvent: zod_1.z.number().min(0).optional(),
    payPostEventDueDate: zod_1.z.coerce.date().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    serviceStartAt: zod_1.z.coerce.date().optional(),
    serviceEndAt: zod_1.z.coerce.date().optional(),
    serviceTimezone: zod_1.z.string().min(3).optional(),
    bookingPartners: zod_1.z.array(exports.bookingPartnerSchema).min(1).optional(),
    splitPaymentEnabled: zod_1.z.boolean().optional(),
    depositPercentage: zod_1.z.number().min(0.1).max(1).optional(),
    depositAmount: zod_1.z.number().positive().optional(),
    depositDueDate: zod_1.z.coerce.date().optional(),
    balanceDueDate: zod_1.z.coerce.date().optional(),
    splitPaymentNotes: zod_1.z.string().max(1000).optional(),
}).refine((data) => {
    // If split payment is enabled, check date logic
    if (data.splitPaymentEnabled && data.depositDueDate && data.balanceDueDate) {
        return data.balanceDueDate > data.depositDueDate;
    }
    return true;
}, {
    message: "Balance due date must be after deposit due date",
    path: ["balanceDueDate"],
}).refine((data) => {
    // If service dates are provided, check they make sense
    if (data.serviceStartAt && data.serviceEndAt) {
        return data.serviceEndAt > data.serviceStartAt;
    }
    return true;
}, {
    message: "Service end date must be after service start date",
    path: ["serviceEndAt"],
});
exports.updateBookingSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2).optional(),
    customerPhoneNumber: zod_1.z.string().optional(),
    serviceTitle: zod_1.z.string().min(2).optional(),
    amount: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    status: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
    paymentStatus: zod_1.z.enum(["UNPAID", "PARTIAL", "PAID"]).optional(),
    paymentType: zod_1.z.enum(["FULL_PAYMENT", "PARTIAL_PAYMENT"]).optional(),
    costAtBooking: zod_1.z.number().min(0).optional(),
    costPostEvent: zod_1.z.number().min(0).optional(),
    payPostEventDueDate: zod_1.z.coerce.date().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    serviceStartAt: zod_1.z.coerce.date().optional(),
    serviceEndAt: zod_1.z.coerce.date().optional(),
    serviceTimezone: zod_1.z.string().min(3).optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
    bookingPartners: zod_1.z.array(exports.bookingPartnerSchema).optional(),
    splitPaymentEnabled: zod_1.z.boolean().optional(),
    depositPercentage: zod_1.z.number().min(0.1).max(1).optional(),
    depositAmount: zod_1.z.number().positive().optional(),
    depositDueDate: zod_1.z.coerce.date().optional(),
    balanceDueDate: zod_1.z.coerce.date().optional(),
    splitPaymentNotes: zod_1.z.string().max(1000).optional(),
}).refine((data) => {
    // If split payment is enabled, check date logic
    if (data.splitPaymentEnabled && data.depositDueDate && data.balanceDueDate) {
        return data.balanceDueDate > data.depositDueDate;
    }
    return true;
}, {
    message: "Balance due date must be after deposit due date",
    path: ["balanceDueDate"],
}).refine((data) => {
    // If service dates are provided, check they make sense
    if (data.serviceStartAt && data.serviceEndAt) {
        return data.serviceEndAt > data.serviceStartAt;
    }
    return true;
}, {
    message: "Service end date must be after service start date",
    path: ["serviceEndAt"],
});
exports.transitionBookingSchema = zod_1.z.object({
    toStatus: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.bookingIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listBookingSchema = pagination_1.paginationSchema
    .merge(zod_1.z.object({
    serviceStartFrom: zod_1.z.coerce.date().optional(),
    serviceStartTo: zod_1.z.coerce.date().optional(),
}))
    .extend({
    search: zod_1.z.string().optional(),
});
exports.calendarBookingSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    serviceStartFrom: zod_1.z.coerce.date().optional(),
    serviceStartTo: zod_1.z.coerce.date().optional(),
}));
//# sourceMappingURL=booking.validation.js.map