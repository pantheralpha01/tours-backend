import { BookingStatus, PaymentStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";

export const bookingLifecycleRules = {
  canConfirm: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status !== "DRAFT") {
      throw ApiError.badRequest("Can only confirm bookings in DRAFT status");
    }
    if (booking.paymentStatus !== "PAID") {
      throw ApiError.badRequest("Cannot confirm booking without payment");
    }
  },

  canCancel: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") {
      throw ApiError.badRequest("Cannot cancel a paid booking");
    }
  },

  canMarkComplete: (booking: { status: BookingStatus; paymentStatus: PaymentStatus }) => {
    if (booking.status !== "CONFIRMED") {
      throw ApiError.badRequest("Can only complete CONFIRMED bookings");
    }
  },
};
