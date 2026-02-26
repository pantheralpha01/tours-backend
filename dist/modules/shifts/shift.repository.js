"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.shiftRepository = {
    create: (data) => prisma_1.prisma.agentShift.create({
        data: {
            agentId: data.agentId,
            bookingId: data.bookingId ?? undefined,
            startAt: data.startAt,
            endAt: data.endAt,
            status: data.status ?? "SCHEDULED",
            notes: data.notes ?? undefined,
        },
        include: { agent: true, booking: true },
    }),
    findByBooking: (bookingId) => prisma_1.prisma.agentShift.findFirst({
        where: { bookingId },
        orderBy: { createdAt: "asc" },
        include: { agent: true, booking: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.agentId) {
            where.agentId = params.agentId;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.startFrom || params?.startTo) {
            where.startAt = {
                ...(params.startFrom ? { gte: params.startFrom } : {}),
                ...(params.startTo ? { lte: params.startTo } : {}),
            };
        }
        return prisma_1.prisma.agentShift.findMany({
            where,
            orderBy: { startAt: params?.sort ?? "asc" },
            skip: params?.skip,
            take: params?.take,
            include: { agent: true, booking: true },
        });
    },
    count: (params) => {
        const where = {};
        if (params?.agentId) {
            where.agentId = params.agentId;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.startFrom || params?.startTo) {
            where.startAt = {
                ...(params.startFrom ? { gte: params.startFrom } : {}),
                ...(params.startTo ? { lte: params.startTo } : {}),
            };
        }
        return prisma_1.prisma.agentShift.count({ where });
    },
    findById: (id) => prisma_1.prisma.agentShift.findUnique({
        where: { id },
        include: { agent: true, booking: true },
    }),
    update: (id, data) => prisma_1.prisma.agentShift.update({
        where: { id },
        data: {
            ...data,
            bookingId: data.bookingId === null ? null : data.bookingId,
            notes: data.notes === null ? null : data.notes,
        },
        include: { agent: true, booking: true },
    }),
    remove: (id) => prisma_1.prisma.agentShift.delete({ where: { id } }),
};
//# sourceMappingURL=shift.repository.js.map