"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.dispatchRepository = {
    create: (data) => prisma_1.prisma.dispatch.create({
        data: {
            bookingId: data.bookingId,
            assignedToId: data.assignedToId,
            status: data.status ?? "PENDING",
            notes: data.notes,
            startedAt: data.startedAt,
            completedAt: data.completedAt,
        },
        include: { booking: true, assignedTo: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.assignedToId) {
            where.assignedToId = params.assignedToId;
        }
        if (params?.agentId) {
            where.OR = [
                { assignedToId: params.agentId },
                { booking: { agentId: params.agentId } },
            ];
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
        return prisma_1.prisma.dispatch.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true, assignedTo: true },
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
        if (params?.assignedToId) {
            where.assignedToId = params.assignedToId;
        }
        if (params?.agentId) {
            where.OR = [
                { assignedToId: params.agentId },
                { booking: { agentId: params.agentId } },
            ];
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.dispatch.count({ where });
    },
    findById: (id) => prisma_1.prisma.dispatch.findUnique({
        where: { id },
        include: { booking: true, assignedTo: true },
    }),
    update: (id, data) => prisma_1.prisma.dispatch.update({
        where: { id },
        data,
        include: { booking: true, assignedTo: true },
    }),
    remove: (id) => prisma_1.prisma.dispatch.delete({ where: { id } }),
};
//# sourceMappingURL=dispatch.repository.js.map