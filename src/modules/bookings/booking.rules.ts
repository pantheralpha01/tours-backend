import { BookingStatus, PaymentStatus } from "@prisma/client";

type StatusContext = {
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

type StatusUpdate = Partial<StatusContext>;

export const validateStatusRules = (
  current: StatusContext,
  next: StatusUpdate
) => {
  const nextStatus = next.status ?? current.status;
  const nextPayment = next.paymentStatus ?? current.paymentStatus;

  if (nextPayment === "PAID" && nextStatus !== "CONFIRMED") {
    throw new Error("Payment can only be marked PAID for CONFIRMED bookings");
  }

  if (nextStatus === "CANCELLED" && nextPayment === "PAID") {
    throw new Error("Cancelled bookings cannot be PAID");
  }
};
