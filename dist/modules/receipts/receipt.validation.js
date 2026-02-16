"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptIdSchema = exports.listReceiptSchema = exports.updateReceiptSchema = exports.createReceiptSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createReceiptSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    paymentId: zod_1.z.string().uuid(),
    receiptNumber: zod_1.z.string().min(3),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    status: zod_1.z.enum(["ISSUED", "VOID"]).optional(),
    issuedAt: zod_1.z.coerce.date().optional(),
    fileUrl: zod_1.z.string().min(5).optional(),
});
exports.updateReceiptSchema = zod_1.z.object({
    status: zod_1.z.enum(["ISSUED", "VOID"]).optional(),
    fileUrl: zod_1.z.string().min(5).optional(),
});
exports.listReceiptSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    paymentId: zod_1.z.string().uuid().optional(),
}));
exports.receiptIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=receipt.validation.js.map