"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeIdSchema = exports.listDisputeSchema = exports.updateDisputeSchema = exports.createDisputeSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createDisputeSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().min(3),
    description: zod_1.z.string().min(3).optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
});
exports.updateDisputeSchema = zod_1.z.object({
    status: zod_1.z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]).optional(),
    reason: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(3).optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
    resolvedAt: zod_1.z.coerce.date().optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.listDisputeSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    openedById: zod_1.z.string().uuid().optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
}));
exports.disputeIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=dispute.validation.js.map