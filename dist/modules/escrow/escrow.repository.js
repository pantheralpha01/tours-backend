"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRepository = exports.escrowRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.escrowRepository = {
    upsertAccount: async (data) => prisma_1.prisma.escrowAccount.upsert({
        where: { bookingId: data.bookingId },
        update: {
            totalAmount: { increment: data.amount },
            currency: data.currency,
            metadata: data.metadata ? data.metadata : undefined,
        },
        create: {
            bookingId: data.bookingId,
            totalAmount: data.amount,
            currency: data.currency,
            metadata: data.metadata ? data.metadata : undefined,
        },
        include: { booking: true },
    }),
    findByBooking: (bookingId) => prisma_1.prisma.escrowAccount.findUnique({
        where: { bookingId },
        include: { booking: true, payouts: true },
    }),
    findDueReleases: (params) => prisma_1.prisma.escrowAccount.findMany({
        where: {
            releaseStatus: "SCHEDULED",
            releaseScheduledAt: { lte: new Date() },
        },
        include: { booking: true, payouts: true },
        orderBy: { releaseScheduledAt: "asc" },
        take: params?.limit,
    }),
    updateStatus: (bookingId, data) => prisma_1.prisma.escrowAccount.update({
        where: { bookingId },
        data: {
            releaseStatus: data.releaseStatus,
            releaseScheduledAt: data.releaseScheduledAt,
            releasedAt: data.releasedAt,
            metadata: data.metadata === undefined ? undefined : data.metadata,
        },
    }),
    deductRelease: (bookingId, amount) => prisma_1.prisma.escrowAccount.update({
        where: { bookingId },
        data: {
            releasedAmount: { increment: amount },
            totalAmount: { decrement: amount },
        },
    }),
};
exports.payoutRepository = {
    create: (data) => prisma_1.prisma.payout.create({
        data: {
            bookingId: data.bookingId,
            escrowAccountId: data.escrowAccountId,
            amount: data.amount,
            currency: data.currency,
            status: data.status ?? "PENDING",
            notes: data.notes ?? undefined,
            createdById: data.createdById ?? undefined,
            metadata: data.metadata === undefined ? undefined : data.metadata,
        },
        include: { booking: true, escrowAccount: true },
    }),
    findMany: (bookingId) => prisma_1.prisma.payout.findMany({
        where: { bookingId },
        orderBy: { createdAt: "desc" },
    }),
    findById: (id) => prisma_1.prisma.payout.findUnique({
        where: { id },
        include: { booking: true, escrowAccount: true },
    }),
    update: (id, data) => prisma_1.prisma.payout.update({
        where: { id },
        data: {
            status: data.status,
            notes: data.notes ?? undefined,
            metadata: data.metadata === undefined ? undefined : data.metadata,
        },
        include: { booking: true, escrowAccount: true },
    }),
};
//# sourceMappingURL=escrow.repository.js.map