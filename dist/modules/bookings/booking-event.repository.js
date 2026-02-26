"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingEventRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.bookingEventRepository = {
    create: (data) => prisma_1.prisma.bookingEvent.create({
        data: {
            bookingId: data.bookingId,
            type: data.type,
            actorId: data.actorId,
            metadata: (data.metadata || undefined),
        },
    }),
    listByBooking: (params) => prisma_1.prisma.bookingEvent.findMany({
        where: {
            bookingId: params.bookingId,
            createdAt: params.dateFrom || params.dateTo ? {
                ...(params.dateFrom ? { gte: params.dateFrom } : {}),
                ...(params.dateTo ? { lte: params.dateTo } : {}),
            } : undefined,
        },
        orderBy: { createdAt: params.sort ?? "desc" },
        skip: params.skip,
        take: params.take,
    }),
    countByBooking: (params) => prisma_1.prisma.bookingEvent.count({
        where: {
            bookingId: params.bookingId,
            createdAt: params.dateFrom || params.dateTo ? {
                ...(params.dateFrom ? { gte: params.dateFrom } : {}),
                ...(params.dateTo ? { lte: params.dateTo } : {}),
            } : undefined,
        },
    }),
};
//# sourceMappingURL=booking-event.repository.js.map