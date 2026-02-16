"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.inventoryRepository = {
    create: (data) => prisma_1.prisma.inventoryItem.create({
        data: {
            partnerId: data.partnerId,
            title: data.title,
            description: data.description,
            price: data.price,
            status: data.status ?? "DRAFT",
        },
        include: { partner: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.createdById) {
            where.partner = { createdById: params.createdById };
        }
        return prisma_1.prisma.inventoryItem.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { partner: true },
        });
    },
    findById: (id) => prisma_1.prisma.inventoryItem.findUnique({ where: { id }, include: { partner: true } }),
    update: (id, data) => prisma_1.prisma.inventoryItem.update({
        where: { id },
        data,
        include: { partner: true },
    }),
    remove: (id) => prisma_1.prisma.inventoryItem.delete({ where: { id } }),
};
//# sourceMappingURL=inventory.repository.js.map