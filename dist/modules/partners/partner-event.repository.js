"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerEventRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.partnerEventRepository = {
    create: (data) => prisma_1.prisma.partnerEvent.create({
        data: {
            partnerId: data.partnerId,
            type: data.type,
            actorId: data.actorId,
            metadata: (data.metadata || undefined),
        },
    }),
    findMany: (params) => {
        const where = { partnerId: params.partnerId };
        if (params.type) {
            where.type = params.type;
        }
        if (params.dateFrom || params.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        const orderBy = {};
        if (params.sort) {
            const [field, order] = params.sort.split(":");
            orderBy[field] = order === "asc" ? "asc" : "desc";
        }
        else {
            orderBy.createdAt = "desc";
        }
        return prisma_1.prisma.partnerEvent.findMany({
            where,
            orderBy,
            skip: params.skip,
            take: params.take,
        });
    },
    count: (params) => {
        const where = { partnerId: params.partnerId };
        if (params.type) {
            where.type = params.type;
        }
        if (params.dateFrom || params.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.partnerEvent.count({ where });
    },
};
//# sourceMappingURL=partner-event.repository.js.map