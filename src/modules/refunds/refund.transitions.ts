import { RefundStatus } from "@prisma/client";
import { TransitionMap } from "../../utils/stateMachine";

export const refundTransitions: TransitionMap<RefundStatus> = {
  REQUESTED: ["APPROVED", "DECLINED"],
  APPROVED: ["PROCESSING"],
  PROCESSING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
  DECLINED: [],
};
