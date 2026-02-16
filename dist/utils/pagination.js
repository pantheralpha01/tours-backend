"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePagination = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10),
    sort: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    dateFrom: zod_1.z.coerce.date().optional(),
    dateTo: zod_1.z.coerce.date().optional(),
});
const calculatePagination = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.calculatePagination = calculatePagination;
//# sourceMappingURL=pagination.js.map