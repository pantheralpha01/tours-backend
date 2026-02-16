"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.receiptRepository = {
    create: (data) => prisma_1.prisma.receipt.create({
        data: {
            bookingId: data.bookingId,
            paymentId: data.paymentId,
            receiptNumber: data.receiptNumber,
            amount: data.amount,
            currency: data.currency,
            status: data.status ?? "ISSUED",
            issuedAt: data.issuedAt ?? new Date(),
            fileUrl: data.fileUrl,
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
            where.issuedAt = {};
            if (params.dateFrom)
                where.issuedAt.gte = params.dateFrom;
            if (params.dateTo)
                where.issuedAt.lte = params.dateTo;
        }
        const orderBy = {};
        if (params?.sort) {
            const [field, order] = params.sort.split(":");
            orderBy[field] = order === "asc" ? "asc" : "desc";
        }
        else {
            orderBy.issuedAt = "desc";
        }
        return prisma_1.prisma.receipt.findMany({
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
            where.issuedAt = {};
            if (params.dateFrom)
                where.issuedAt.gte = params.dateFrom;
            if (params.dateTo)
                where.issuedAt.lte = params.dateTo;
        }
        return prisma_1.prisma.receipt.count({ where });
    },
    findById: (id) => prisma_1.prisma.receipt.findUnique({ where: { id }, include: { booking: true, payment: true } }),
    update: (id, data) => prisma_1.prisma.receipt.update({
        where: { id },
        data,
        include: { booking: true, payment: true },
    }),
    remove: (id) => prisma_1.prisma.receipt.delete({ where: { id } }),
};
//# sourceMappingURL=receipt.repository.js.map