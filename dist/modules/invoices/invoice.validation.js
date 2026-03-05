"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionIdSchema = exports.updateTransactionSchema = exports.createTransactionSchema = exports.invoiceQuerySchema = exports.listInvoicesSchema = exports.sendInvoiceSchema = exports.invoiceIdSchema = exports.updateInvoiceStatusSchema = exports.createInvoiceSchema = exports.transactionTypeEnum = exports.invoiceStatusEnum = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.invoiceStatusEnum = zod_1.z.enum([
    "DRAFT",
    "SENT",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
]);
exports.transactionTypeEnum = zod_1.z.enum(["DEPOSIT", "BALANCE"]);
exports.createInvoiceSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    customerName: zod_1.z.string().min(2).max(255),
    customerEmail: zod_1.z.string().email(),
    totalAmount: zod_1.z.number().positive(),
    depositAmount: zod_1.z.number().positive(),
    balanceAmount: zod_1.z.number().nonnegative(),
    dueDate: zod_1.z.coerce.date(),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.updateInvoiceStatusSchema = zod_1.z.object({
    status: exports.invoiceStatusEnum,
    transitionReason: zod_1.z.string().max(500).optional(),
});
exports.invoiceIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.sendInvoiceSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    paymentLink: zod_1.z.string().url().optional(),
    customMessage: zod_1.z.string().max(1000).optional(),
});
exports.listInvoicesSchema = zod_1.z.object({
    ...pagination_1.paginationSchema.shape,
    bookingId: zod_1.z.string().uuid().optional(),
    status: exports.invoiceStatusEnum.optional(),
    customerEmail: zod_1.z.string().email().optional(),
});
exports.invoiceQuerySchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    status: exports.invoiceStatusEnum.optional(),
    customerEmail: zod_1.z.string().email().optional(),
    skip: zod_1.z.coerce.number().min(0).default(0),
    take: zod_1.z.coerce.number().min(1).max(100).default(10),
});
exports.createTransactionSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    transactionId: zod_1.z.string().min(3),
    type: exports.transactionTypeEnum,
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).default("KES"),
    status: zod_1.z
        .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
        .default("PENDING"),
    paymentMethod: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updateTransactionSchema = zod_1.z.object({
    status: zod_1.z
        .enum(["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"])
        .optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.transactionIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=invoice.validation.js.map