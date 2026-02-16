"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.quoteRepository = {
    create: (data) => prisma_1.prisma.quote.create({
        data: {
            bookingId: data.bookingId,
            agentId: data.agentId,
            title: data.title,
            amount: data.amount,
            currency: data.currency,
            commissionRate: data.commissionRate,
            commissionAmount: data.commissionAmount,
            commissionCurrency: data.commissionCurrency,
            expiresAt: data.expiresAt,
            items: data.items ? data.items : null,
            notes: data.notes,
        },
        include: { booking: true, agent: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.agentId) {
            where.agentId = params.agentId;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        const orderBy = {};
        if (params?.sort) {
            const [field, order] = params.sort.split(":");
            orderBy[field] = order === "asc" ? "asc" : "desc";
        }
        else {
            orderBy.createdAt = "desc";
        }
        return prisma_1.prisma.quote.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true, agent: true },
        });
    },
    count: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.agentId) {
            where.agentId = params.agentId;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.quote.count({ where });
    },
    findById: (id) => prisma_1.prisma.quote.findUnique({ where: { id }, include: { booking: true, agent: true } }),
    update: (id, data) => {
        const updateData = { ...data };
        if (data.items !== undefined) {
            updateData.items = data.items ? data.items : null;
        }
        return prisma_1.prisma.quote.update({
            where: { id },
            data: updateData,
            include: { booking: true, agent: true },
        });
    },
    remove: (id) => prisma_1.prisma.quote.delete({ where: { id } }),
};
//# sourceMappingURL=quote.repository.js.map