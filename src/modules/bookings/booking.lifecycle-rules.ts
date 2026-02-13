import { BookingStatus, PaymentStatus } from "@prisma/client";

export const bookingLifecycleRules = {
  canConfirm: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status !== "DRAFT") {
      throw new Error("Can only confirm bookings in DRAFT status");
    }
    if (booking.paymentStatus !== "PAID") {
      throw new Error("Cannot confirm booking without payment");
    }
  },

  canCancel: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") {
      throw new Error("Cannot cancel a paid booking");
    }
  },

  canMarkComplete: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status !== "CONFIRMED") {
      throw new Error("Can only complete CONFIRMED bookings");
    }
  },
};
