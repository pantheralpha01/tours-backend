"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectPartnerSchema = exports.partnerIdSchema = exports.listPartnerSchema = exports.updatePartnerSchema = exports.createPartnerSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createPartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(7).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updatePartnerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(7).optional(),
    isActive: zod_1.z.boolean().optional(),
    approvalStatus: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    rejectedReason: zod_1.z.string().min(3).optional(),
});
exports.listPartnerSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    approvalStatus: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    createdById: zod_1.z.string().uuid().optional(),
}));
exports.partnerIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.rejectPartnerSchema = zod_1.z.object({
    reason: zod_1.z.string().min(3).optional(),
});
//# sourceMappingURL=partner.validation.js.map