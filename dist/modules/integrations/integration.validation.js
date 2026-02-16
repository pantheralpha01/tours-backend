"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIntentSchema = exports.airtableSyncSchema = exports.respondWebhookSchema = exports.sendWhatsappSchema = void 0;
const zod_1 = require("zod");
exports.sendWhatsappSchema = zod_1.z.object({
    to: zod_1.z.string().min(6),
    message: zod_1.z.string().min(1),
});
exports.respondWebhookSchema = zod_1.z.record(zod_1.z.any());
exports.airtableSyncSchema = zod_1.z.object({
    action: zod_1.z.enum(["pull", "push"]),
    table: zod_1.z.string().min(1).optional(),
});
exports.paymentIntentSchema = zod_1.z.object({
    provider: zod_1.z.enum(["MPESA", "PAYPAL", "VISA", "MASTERCARD", "STRIPE"]),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.enum(["USD", "KES"]).optional(),
    reference: zod_1.z.string().min(3).optional(),
});
//# sourceMappingURL=integration.validation.js.map