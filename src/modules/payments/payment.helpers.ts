import { prisma } from "../../config/prisma";

export const paymentHelpers = {
  getTotalSuccessfulPayments: async (bookingId: string) => {
    const result = await prisma.payment.aggregate({
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

  canAddPayment: async (bookingId: string) => {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.status === "CANCELLED") {
      throw new Error("Cannot add payment to cancelled booking");
    }
    return true;
  },

  syncPaymentStatus: async (bookingId: string) => {
    const totalPaid = await paymentHelpers.getTotalSuccessfulPayments(bookingId);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const bookingAmount = typeof booking.amount === 'object' && booking.amount !== null && 'toNumber' in booking.amount 
      ? (booking.amount as any).toNumber() 
      : Number(booking.amount);
    
    if (totalPaid >= bookingAmount) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID" },
      });
      return "PAID";
    } else {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "UNPAID" },
      });
      return "UNPAID";
    }
  },
};
