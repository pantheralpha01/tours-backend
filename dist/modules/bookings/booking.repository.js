"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.bookingRepository = {
    create: (data) => prisma_1.prisma.booking.create({
        data: {
            customerName: data.customerName,
            serviceTitle: data.serviceTitle,
            amount: data.amount,
            currency: data.currency ?? "USD",
            commissionRate: data.commissionRate,
            commissionAmount: data.commissionAmount,
            commissionCurrency: data.commissionCurrency ?? "KES",
            status: data.status ?? "DRAFT",
            paymentStatus: data.paymentStatus ?? "UNPAID",
            agentId: data.agentId,
            serviceStartAt: data.serviceStartAt,
            serviceEndAt: data.serviceEndAt,
            serviceTimezone: data.serviceTimezone,
        },
    }),
    findMany: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
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
        if (params?.serviceStartFrom || params?.serviceStartTo) {
            where.serviceStartAt = {};
            if (params.serviceStartFrom) {
                where.serviceStartAt.gte = params.serviceStartFrom;
            }
            if (params.serviceStartTo) {
                where.serviceStartAt.lte = params.serviceStartTo;
            }
        }
        const orderBy = {};
        if (params?.sort) {
            const [field, order] = params.sort.split(":");
            orderBy[field] = order === "asc" ? "asc" : "desc";
        }
        else {
            orderBy.createdAt = "desc";
        }
        return prisma_1.prisma.booking.findMany({
            where,
            orderBy,
            skip: params?.skip,
            take: params?.take,
            include: { agent: true },
        });
    },
    count: (params) => {
        const where = {};
        if (params?.status) {
            where.status = params.status;
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
        if (params?.serviceStartFrom || params?.serviceStartTo) {
            where.serviceStartAt = {};
            if (params.serviceStartFrom) {
                where.serviceStartAt.gte = params.serviceStartFrom;
            }
            if (params.serviceStartTo) {
                where.serviceStartAt.lte = params.serviceStartTo;
            }
        }
        return prisma_1.prisma.booking.count({ where });
    },
    findById: (id) => prisma_1.prisma.booking.findUnique({ where: { id }, include: { agent: true } }),
    update: (id, data) => prisma_1.prisma.booking.update({
        where: { id },
        data,
        include: { agent: true },
    }),
    remove: (id) => prisma_1.prisma.booking.delete({ where: { id } }),
};
//# sourceMappingURL=booking.repository.js.map