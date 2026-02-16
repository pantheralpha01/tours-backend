"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteIdSchema = exports.listQuoteSchema = exports.updateQuoteSchema = exports.createQuoteSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createQuoteSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(2),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
    items: zod_1.z.record(zod_1.z.any()).optional(),
    notes: zod_1.z.string().min(2).optional(),
    agentId: zod_1.z.string().uuid().optional(),
});
exports.updateQuoteSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).optional(),
    status: zod_1.z.enum(["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]).optional(),
    amount: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
    items: zod_1.z.record(zod_1.z.any()).optional(),
    notes: zod_1.z.string().min(2).optional(),
});
exports.listQuoteSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    agentId: zod_1.z.string().uuid().optional(),
}));
exports.quoteIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=quote.validation.js.map