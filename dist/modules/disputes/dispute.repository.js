"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.disputeRepository = {
    create: (data) => prisma_1.prisma.dispute.create({
        data: {
            bookingId: data.bookingId,
            reason: data.reason,
            description: data.description,
            openedById: data.openedById,
            assignedToId: data.assignedToId,
        },
        include: { booking: true, openedBy: true, assignedTo: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.openedById) {
            where.openedById = params.openedById;
        }
        if (params?.assignedToId) {
            where.assignedToId = params.assignedToId;
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
        return prisma_1.prisma.dispute.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true, openedBy: true, assignedTo: true },
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
        if (params?.openedById) {
            where.openedById = params.openedById;
        }
        if (params?.assignedToId) {
            where.assignedToId = params.assignedToId;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.dispute.count({ where });
    },
    findById: (id) => prisma_1.prisma.dispute.findUnique({
        where: { id },
        include: { booking: true, openedBy: true, assignedTo: true },
    }),
    update: (id, data) => prisma_1.prisma.dispute.update({
        where: { id },
        data,
        include: { booking: true, openedBy: true, assignedTo: true },
    }),
    remove: (id) => prisma_1.prisma.dispute.delete({ where: { id } }),
};
//# sourceMappingURL=dispute.repository.js.map