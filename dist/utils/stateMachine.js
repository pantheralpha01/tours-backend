"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTransition = void 0;
const ApiError_1 = require("./ApiError");
const assertTransition = (params) => {
    const { entity, currentState, targetState, transitions } = params;
    if (currentState === targetState) {
        return;
    }
    const allowed = transitions[currentState] ?? [];
    if (!allowed.includes(targetState)) {
        throw ApiError_1.ApiError.badRequest(`Invalid ${entity} transition from ${currentState} to ${targetState}`, "INVALID_STATE_TRANSITION");
    }
};
exports.assertTransition = assertTransition;
//# sourceMappingURL=stateMachine.js.map