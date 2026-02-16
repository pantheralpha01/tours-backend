"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.paymentRepository = {
    create: (data) => prisma_1.prisma.payment.create({
        data: {
            bookingId: data.bookingId,
            provider: data.provider,
            amount: data.amount,
            currency: data.currency ?? "USD",
            reference: data.reference,
            metadata: data.metadata ? data.metadata : null,
        },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.state = params.status;
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
        return prisma_1.prisma.payment.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true },
        });
    },
    count: (params) => {
        const where = {};
        if (params?.status) {
            where.state = params.status;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.payment.count({ where });
    },
    findById: (id) => prisma_1.prisma.payment.findUnique({ where: { id }, include: { booking: true } }),
    update: (id, data) => {
        const updateData = {};
        if (data.state !== undefined)
            updateData.state = data.state;
        if (data.reference !== undefined)
            updateData.reference = data.reference;
        if (data.metadata !== undefined)
            updateData.metadata = data.metadata ? data.metadata : null;
        return prisma_1.prisma.payment.update({
            where: { id },
            data: updateData,
            include: { booking: true },
        });
    },
    remove: (id) => prisma_1.prisma.payment.delete({ where: { id } }),
};
//# sourceMappingURL=payment.repository.js.map