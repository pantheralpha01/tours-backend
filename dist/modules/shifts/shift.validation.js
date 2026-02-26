"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShiftSchema = exports.shiftIdSchema = exports.updateShiftSchema = exports.createShiftSchema = exports.shiftStatusEnum = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.shiftStatusEnum = zod_1.z.enum([
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
]);
const ensureChronology = (schema) => schema.superRefine((data, ctx) => {
    if (data.startAt && data.endAt && data.endAt <= data.startAt) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "endAt must be after startAt",
            path: ["endAt"],
        });
    }
});
exports.createShiftSchema = ensureChronology(zod_1.z.object({
    agentId: zod_1.z.string().uuid().optional(),
    bookingId: zod_1.z.string().uuid().optional(),
    startAt: zod_1.z.coerce.date(),
    endAt: zod_1.z.coerce.date(),
    status: exports.shiftStatusEnum.optional(),
    notes: zod_1.z.string().max(1000).optional(),
}));
exports.updateShiftSchema = ensureChronology(zod_1.z.object({
    agentId: zod_1.z.string().uuid().optional(),
    bookingId: zod_1.z.string().uuid().optional().nullable(),
    startAt: zod_1.z.coerce.date().optional(),
    endAt: zod_1.z.coerce.date().optional(),
    status: exports.shiftStatusEnum.optional(),
    notes: zod_1.z.string().max(1000).optional().nullable(),
}));
exports.shiftIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listShiftSchema = pagination_1.paginationSchema.extend({
    agentId: zod_1.z.string().uuid().optional(),
    startFrom: zod_1.z.coerce.date().optional(),
    startTo: zod_1.z.coerce.date().optional(),
    status: exports.shiftStatusEnum.optional(),
    bookingId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=shift.validation.js.map