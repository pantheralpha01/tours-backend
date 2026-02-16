"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundIdSchema = exports.listRefundSchema = exports.updateRefundSchema = exports.createRefundSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createRefundSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    paymentId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    reason: zod_1.z.string().min(3),
    reference: zod_1.z.string().min(3).optional(),
});
exports.updateRefundSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "REQUESTED",
        "APPROVED",
        "DECLINED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
    ]).optional(),
    reference: zod_1.z.string().min(3).optional(),
    processedAt: zod_1.z.coerce.date().optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.listRefundSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    paymentId: zod_1.z.string().uuid().optional(),
}));
exports.refundIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=refund.validation.js.map