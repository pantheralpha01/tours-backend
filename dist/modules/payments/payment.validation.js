"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIdSchema = exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    provider: zod_1.z.enum(["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD"]),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    reference: zod_1.z.string().min(3).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updatePaymentSchema = zod_1.z.object({
    state: zod_1.z.enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
    reference: zod_1.z.string().min(3).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.paymentIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=payment.validation.js.map