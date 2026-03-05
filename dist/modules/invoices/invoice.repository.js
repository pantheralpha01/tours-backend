"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRepository = exports.invoiceRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.invoiceRepository = {
    create: async (data) => {
        return prisma_1.prisma.invoice.create({
            data: {
                ...data,
                status: "DRAFT",
                paidAmount: 0,
            },
        });
    },
    findById: async (id) => {
        return prisma_1.prisma.invoice.findUnique({
            where: { id },
            include: {
                booking: true,
                transactions: true,
            },
        });
    },
    findByInvoiceNumber: async (invoiceNumber) => {
        return prisma_1.prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: {
                booking: true,
                transactions: true,
            },
        });
    },
    findByBookingId: async (bookingId, skip = 0, take = 10) => {
        const [invoices, total] = await Promise.all([
            prisma_1.prisma.invoice.findMany({
                where: { bookingId },
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    transactions: true,
                },
            }),
            prisma_1.prisma.invoice.count({
                where: { bookingId },
            }),
        ]);
        return { invoices, total };
    },
    findMany: async (filters, skip = 0, take = 10) => {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.customerEmail) {
            where.customerEmail = filters.customerEmail;
        }
        if (filters?.bookingId) {
            where.bookingId = filters.bookingId;
        }
        const [invoices, total] = await Promise.all([
            prisma_1.prisma.invoice.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    transactions: true,
                },
            }),
            prisma_1.prisma.invoice.count({ where }),
        ]);
        return { invoices, total };
    },
    updateStatus: async (id, status) => {
        return prisma_1.prisma.invoice.update({
            where: { id },
            data: { status },
            include: {
                transactions: true,
            },
        });
    },
    updatePaymentInfo: async (id, data) => {
        return prisma_1.prisma.invoice.update({
            where: { id },
            data: {
                ...data,
            },
            include: {
                transactions: true,
            },
        });
    },
    delete: async (id) => {
        return prisma_1.prisma.invoice.delete({
            where: { id },
        });
    },
};
exports.transactionRepository = {
    create: async (data) => {
        return prisma_1.prisma.transaction.create({
            data,
        });
    },
    findById: async (id) => {
        return prisma_1.prisma.transaction.findUnique({
            where: { id },
            include: {
                invoice: true,
            },
        });
    },
    findByTransactionId: async (transactionId) => {
        return prisma_1.prisma.transaction.findFirst({
            where: { transactionId },
            include: {
                invoice: true,
            },
        });
    },
    findByInvoiceId: async (invoiceId) => {
        return prisma_1.prisma.transaction.findMany({
            where: { invoiceId },
            orderBy: { createdAt: "desc" },
        });
    },
    updateStatus: async (id, status, metadata) => {
        return prisma_1.prisma.transaction.update({
            where: { id },
            data: {
                status,
                metadata: metadata ? { ...metadata } : undefined,
            },
            include: {
                invoice: true,
            },
        });
    },
    delete: async (id) => {
        return prisma_1.prisma.transaction.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=invoice.repository.js.map