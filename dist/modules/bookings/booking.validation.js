"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarBookingSchema = exports.listBookingSchema = exports.bookingIdSchema = exports.transitionBookingSchema = exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createBookingSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2),
    serviceTitle: zod_1.z.string().min(2),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    status: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
    paymentStatus: zod_1.z.enum(["UNPAID", "PAID"]).optional(),
    agentId: zod_1.z.string().uuid().optional(),
    serviceStartAt: zod_1.z.coerce.date().optional(),
    serviceEndAt: zod_1.z.coerce.date().optional(),
    serviceTimezone: zod_1.z.string().min(3).optional(),
});
exports.updateBookingSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2).optional(),
    serviceTitle: zod_1.z.string().min(2).optional(),
    amount: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    status: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
    paymentStatus: zod_1.z.enum(["UNPAID", "PAID"]).optional(),
    agentId: zod_1.z.string().uuid().optional(),
    serviceStartAt: zod_1.z.coerce.date().optional(),
    serviceEndAt: zod_1.z.coerce.date().optional(),
    serviceTimezone: zod_1.z.string().min(3).optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.transitionBookingSchema = zod_1.z.object({
    toStatus: zod_1.z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.bookingIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listBookingSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    serviceStartFrom: zod_1.z.coerce.date().optional(),
    serviceStartTo: zod_1.z.coerce.date().optional(),
}));
exports.calendarBookingSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    serviceStartFrom: zod_1.z.coerce.date().optional(),
    serviceStartTo: zod_1.z.coerce.date().optional(),
}));
//# sourceMappingURL=booking.validation.js.map