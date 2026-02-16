"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrackPointSchema = exports.listDispatchSchema = exports.dispatchIdSchema = exports.updateDispatchSchema = exports.createDispatchSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createDispatchSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    assignedToId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    notes: zod_1.z.string().min(2).optional(),
    startedAt: zod_1.z.coerce.date().optional(),
    completedAt: zod_1.z.coerce.date().optional(),
});
exports.updateDispatchSchema = zod_1.z.object({
    assignedToId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    notes: zod_1.z.string().min(2).optional(),
    startedAt: zod_1.z.coerce.date().optional(),
    completedAt: zod_1.z.coerce.date().optional(),
    transitionReason: zod_1.z.string().min(2).optional(),
});
exports.dispatchIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listDispatchSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
    bookingId: zod_1.z.string().uuid().optional(),
}));
exports.createTrackPointSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    recordedAt: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
//# sourceMappingURL=dispatch.validation.js.map