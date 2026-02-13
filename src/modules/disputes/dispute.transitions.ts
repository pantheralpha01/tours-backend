import { DisputeStatus } from "@prisma/client";
import { TransitionMap } from "../../utils/stateMachine";

export const disputeTransitions: TransitionMap<DisputeStatus> = {
  OPEN: ["UNDER_REVIEW", "RESOLVED", "REJECTED"],
  UNDER_REVIEW: ["RESOLVED", "REJECTED"],
  RESOLVED: [],
  REJECTED: [],
};
