"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentHelpers = void 0;
const prisma_1 = require("../../config/prisma");
exports.paymentHelpers = {
    getTotalSuccessfulPayments: async (bookingId) => {
        const result = await prisma_1.prisma.payment.aggregate({
            where: {
                bookingId,
                state: "COMPLETED",
            },
            _sum: {
                amount: true,
            },
        });
        return result._sum.amount ?? 0;
    },
    canAddPayment: async (bookingId) => {
        const booking = await prisma_1.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.status === "CANCELLED") {
            throw new Error("Cannot add payment to cancelled booking");
        }
        return true;
    },
    syncPaymentStatus: async (bookingId) => {
        const totalPaid = await exports.paymentHelpers.getTotalSuccessfulPayments(bookingId);
        const booking = await prisma_1.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) {
            throw new Error("Booking not found");
        }
        const bookingAmount = typeof booking.amount === 'object' && booking.amount !== null && 'toNumber' in booking.amount
            ? booking.amount.toNumber()
            : Number(booking.amount);
        if (totalPaid >= bookingAmount) {
            await prisma_1.prisma.booking.update({
                where: { id: bookingId },
                data: { paymentStatus: "PAID" },
            });
            return "PAID";
        }
        else {
            await prisma_1.prisma.booking.update({
                where: { id: bookingId },
                data: { paymentStatus: "UNPAID" },
            });
            return "UNPAID";
        }
    },
};
//# sourceMappingURL=payment.helpers.js.map