"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhookSchema = exports.webhookProviderParamSchema = exports.paymentIdSchema = exports.updatePaymentSchema = exports.manualPaymentSchema = exports.initiatePaymentSchema = exports.createPaymentSchema = exports.manualProviderEnum = exports.paymentProviderEnum = void 0;
const zod_1 = require("zod");
exports.paymentProviderEnum = zod_1.z.enum([
    "MPESA",
    "STRIPE",
    "PAYPAL",
    "VISA",
    "MASTERCARD",
    "CRYPTO",
]);
exports.manualProviderEnum = zod_1.z.enum([
    "CASH",
    "BANK_TRANSFER",
    "MPESA",
    "PAYPAL",
    "VISA",
    "MASTERCARD",
    "CRYPTO",
    "OTHER",
]);
const basePaymentSchema = {
    bookingId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    reference: zod_1.z.string().min(3).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
};
exports.createPaymentSchema = zod_1.z.object({
    ...basePaymentSchema,
    provider: exports.paymentProviderEnum,
});
exports.initiatePaymentSchema = zod_1.z.object({
    ...basePaymentSchema,
    provider: exports.paymentProviderEnum,
});
exports.manualPaymentSchema = zod_1.z.object({
    ...basePaymentSchema,
    provider: exports.manualProviderEnum.optional().default("CASH"),
    notes: zod_1.z.string().max(1000).optional(),
    recordedAt: zod_1.z.coerce.date().optional(),
});
exports.updatePaymentSchema = zod_1.z.object({
    state: zod_1.z
        .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
        .optional(),
    reference: zod_1.z.string().min(3).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.paymentIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.webhookProviderParamSchema = zod_1.z.object({
    provider: exports.paymentProviderEnum,
});
exports.paymentWebhookSchema = zod_1.z.object({
    reference: zod_1.z.string().min(3),
    status: zod_1.z.string().min(2),
    amount: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    eventType: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    eventId: zod_1.z.string().min(3).optional(),
    reason: zod_1.z.string().optional(),
});
//# sourceMappingURL=payment.validation.js.map