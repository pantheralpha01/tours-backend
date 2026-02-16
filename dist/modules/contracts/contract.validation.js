"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractIdSchema = exports.listContractSchema = exports.updateContractSchema = exports.createContractSchema = void 0;
const zod_1 = require("zod");
const pagination_1 = require("../../utils/pagination");
exports.createContractSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid(),
    partnerId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["DRAFT", "SENT", "SIGNED", "CANCELLED"]).optional(),
    fileUrl: zod_1.z.string().min(5).optional(),
    signedAt: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updateContractSchema = zod_1.z.object({
    partnerId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(["DRAFT", "SENT", "SIGNED", "CANCELLED"]).optional(),
    fileUrl: zod_1.z.string().min(5).optional(),
    signedAt: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.listContractSchema = pagination_1.paginationSchema.merge(zod_1.z.object({
    bookingId: zod_1.z.string().uuid().optional(),
    partnerId: zod_1.z.string().uuid().optional(),
}));
exports.contractIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=contract.validation.js.map