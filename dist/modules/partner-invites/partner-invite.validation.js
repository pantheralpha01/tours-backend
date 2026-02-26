"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptPartnerInviteSchema = exports.listPartnerInviteSchema = exports.createPartnerInviteSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
const inviteStatusEnum = zod_1.z.enum(["PENDING", "ACCEPTED", "EXPIRED"]);
exports.createPartnerInviteSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2, "Company name is required"),
    email: zod_1.z.string().email(),
    expiresInDays: zod_1.z.number().int().min(1).max(60).optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.listPartnerInviteSchema = pagination_1.paginationSchema.extend({
    status: inviteStatusEnum.optional(),
    invitedById: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
});
exports.acceptPartnerInviteSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2).optional(),
    contactName: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(7).optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
//# sourceMappingURL=partner-invite.validation.js.map