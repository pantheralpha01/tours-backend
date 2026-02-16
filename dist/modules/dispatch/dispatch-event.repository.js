"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchEventRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.dispatchEventRepository = {
    create: (data) => prisma_1.prisma.dispatchEvent.create({
        data: {
            dispatchId: data.dispatchId,
            type: data.type,
            actorId: data.actorId,
            metadata: (data.metadata || undefined),
        },
    }),
    findMany: (params) => {
        const where = { dispatchId: params.dispatchId };
        if (params.dateFrom || params.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.dispatchEvent.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: params.take,
        });
    },
};
//# sourceMappingURL=dispatch-event.repository.js.map