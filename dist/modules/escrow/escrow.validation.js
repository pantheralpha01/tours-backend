"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutStatusSchema = exports.payoutParamSchema = exports.bookingParamSchema = exports.escrowReleaseSchema = void 0;
const zod_1 = require("zod");
exports.escrowReleaseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).default("USD"),
    notes: zod_1.z.string().max(1000).optional(),
    releaseAt: zod_1.z.coerce.date().optional(),
});
exports.bookingParamSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
});
exports.payoutParamSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    payoutId: zod_1.z.string().uuid(),
});
exports.payoutStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "SENT", "CANCELLED"]),
    transactionReference: zod_1.z.string().max(191).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
//# sourceMappingURL=escrow.validation.js.map