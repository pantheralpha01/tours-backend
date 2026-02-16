export type TransitionMap<State extends string> = Record<State, readonly State[]>;
export declare const assertTransition: <State extends string>(params: {
    entity: string;
    currentState: State;
    targetState: State;
    transitions: TransitionMap<State>;
}) => void;
//# sourceMappingURL=stateMachine.d.ts.map