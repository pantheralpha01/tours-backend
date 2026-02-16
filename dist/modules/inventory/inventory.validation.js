"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryIdSchema = exports.updateInventorySchema = exports.createInventorySchema = void 0;
const zod_1 = require("zod");
exports.createInventorySchema = zod_1.z.object({
    partnerId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().min(2).optional(),
    price: zod_1.z.number().positive(),
    status: zod_1.z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
});
exports.updateInventorySchema = zod_1.z.object({
    partnerId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(2).optional(),
    price: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
});
exports.inventoryIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=inventory.validation.js.map