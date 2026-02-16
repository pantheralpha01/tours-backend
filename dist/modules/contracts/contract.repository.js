"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.contractRepository = {
    create: (data) => prisma_1.prisma.contract.create({
        data: {
            bookingId: data.bookingId,
            partnerId: data.partnerId,
            status: data.status ?? "DRAFT",
            fileUrl: data.fileUrl,
            signedAt: data.signedAt,
            metadata: data.metadata ? data.metadata : null,
        },
        include: { booking: true, partner: true },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.bookingId) {
            where.bookingId = params.bookingId;
        }
        if (params?.partnerId) {
            where.partnerId = params.partnerId;
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
        return prisma_1.prisma.contract.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { booking: true, partner: true },
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
        if (params?.partnerId) {
            where.partnerId = params.partnerId;
        }
        if (params?.dateFrom || params?.dateTo) {
            where.createdAt = {};
            if (params.dateFrom)
                where.createdAt.gte = params.dateFrom;
            if (params.dateTo)
                where.createdAt.lte = params.dateTo;
        }
        return prisma_1.prisma.contract.count({ where });
    },
    findById: (id) => prisma_1.prisma.contract.findUnique({ where: { id }, include: { booking: true, partner: true } }),
    update: (id, data) => {
        const updateData = { ...data };
        if (data.metadata !== undefined) {
            updateData.metadata = data.metadata ? data.metadata : null;
        }
        return prisma_1.prisma.contract.update({
            where: { id },
            data: updateData,
            include: { booking: true, partner: true },
        });
    },
    remove: (id) => prisma_1.prisma.contract.delete({ where: { id } }),
};
//# sourceMappingURL=contract.repository.js.map