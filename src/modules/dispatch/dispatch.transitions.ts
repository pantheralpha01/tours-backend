import { DispatchStatus } from "@prisma/client";
import { TransitionMap } from "../../utils/stateMachine";

export const dispatchTransitions: TransitionMap<DispatchStatus> = {
  PENDING: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};
