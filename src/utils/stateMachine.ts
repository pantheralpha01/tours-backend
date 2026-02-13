import { ApiError } from "./ApiError";

export type TransitionMap<State extends string> = Record<State, readonly State[]>;

export const assertTransition = <State extends string>(params: {
  entity: string;
  currentState: State;
  targetState: State;
  transitions: TransitionMap<State>;
}) => {
  const { entity, currentState, targetState, transitions } = params;
  if (currentState === targetState) {
    return;
  }
  const allowed = transitions[currentState] ?? [];
  if (!allowed.includes(targetState)) {
    throw ApiError.badRequest(
      `Invalid ${entity} transition from ${currentState} to ${targetState}`,
      "INVALID_STATE_TRANSITION"
    );
  }
};
