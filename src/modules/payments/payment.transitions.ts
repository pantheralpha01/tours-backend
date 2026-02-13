import { PaymentState } from "@prisma/client";
import { TransitionMap } from "../../utils/stateMachine";

export const paymentTransitions: TransitionMap<PaymentState> = {
  INITIATED: ["PENDING", "CANCELLED", "FAILED"],
  PENDING: ["COMPLETED", "FAILED", "CANCELLED"],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: [],
};
