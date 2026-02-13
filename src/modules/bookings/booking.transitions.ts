import { BookingStatus } from "@prisma/client";
import { TransitionMap } from "../../utils/stateMachine";

export const bookingTransitions: TransitionMap<BookingStatus> = {
  DRAFT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CANCELLED"],
  CANCELLED: [],
};
