"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.refundRepository = {
    create: (data) => prisma_1.prisma.refund.create({
        data: {
            bookingId: data.bookingId,
            paymentId: data.paymentId,
            amount: data.amount,
            currency: data.currency,
            reason: data.reason,
            reference: data.reference,
        },
        include: { booking: true, payment: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.paymentId) {
            where.paymentId = params.paymentId;
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
        return prisma_1.prisma.refund.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true, payment: true },
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
        if (params?.paymentId) {
            where.paymentId = params.paymentId;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.refund.count({ where });
    },
    findById: (id) => prisma_1.prisma.refund.findUnique({ where: { id }, include: { booking: true, payment: true } }),
    update: (id, data) => prisma_1.prisma.refund.update({
        where: { id },
        data,
        include: { booking: true, payment: true },
    }),
    remove: (id) => prisma_1.prisma.refund.delete({ where: { id } }),
};
//# sourceMappingURL=refund.repository.js.map