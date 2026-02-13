import { BookingStatus } from "@prisma/client";

export const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
};

export const assertValidTransition = (
  from: BookingStatus,
  to: BookingStatus
) => {
  const allowed = allowedTransitions[from] ?? [];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid status transition from ${from} to ${to}`);
  }
};
