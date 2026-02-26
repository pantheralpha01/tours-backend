"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishProposalSchema = exports.approveProposalSchema = exports.idParamSchema = exports.listProposalsSchema = exports.listTemplatesSchema = exports.proposalSchema = exports.priceCalculationSchema = exports.templateSchema = exports.itineraryItemSchema = exports.addonSchema = exports.currencyEnum = void 0;
const zod_1 = require("zod");
exports.currencyEnum = zod_1.z.enum(["USD", "KES"]);
exports.addonSchema = zod_1.z.object({
    label: zod_1.z.string().min(2),
    amount: zod_1.z.number().min(0),
});
exports.itineraryItemSchema = zod_1.z.object({
    day: zod_1.z.number().min(1),
    title: zod_1.z.string().min(2),
    summary: zod_1.z.string().optional(),
    activities: zod_1.z.array(zod_1.z.string().min(2)).optional(),
    notes: zod_1.z.string().optional(),
});
exports.templateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    slug: zod_1.z.string().min(3),
    description: zod_1.z.string().optional(),
    defaultCurrency: exports.currencyEnum.optional(),
    baseAmount: zod_1.z.number().positive().optional(),
    feePercentage: zod_1.z.number().min(0).max(1).optional(),
    itinerary: zod_1.z.array(exports.itineraryItemSchema).optional(),
    addons: zod_1.z.array(exports.addonSchema).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.priceCalculationSchema = zod_1.z.object({
    baseAmount: zod_1.z.number().positive(),
    addons: zod_1.z.array(exports.addonSchema).optional(),
    currency: exports.currencyEnum.optional(),
    discountRateOverride: zod_1.z.number().min(0).max(0.5).optional(),
});
exports.proposalSchema = exports.priceCalculationSchema.extend({
    bookingId: zod_1.z.string().uuid(),
    templateId: zod_1.z.string().uuid().optional(),
    itinerary: zod_1.z.array(exports.itineraryItemSchema).optional(),
    notes: zod_1.z.string().max(2000).optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.listTemplatesSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
    search: zod_1.z.string().optional(),
});
exports.listProposalsSchema = exports.listTemplatesSchema.extend({
    status: zod_1.z.enum(["DRAFT", "APPROVED", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
    bookingId: zod_1.z.string().uuid().optional(),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.approveProposalSchema = zod_1.z.object({
    notes: zod_1.z.string().max(2000).optional(),
});
exports.publishProposalSchema = zod_1.z.object({
    channel: zod_1.z.enum(["EMAIL", "SMS", "WHATSAPP", "LINK"]).optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
//# sourceMappingURL=offer.validation.js.map