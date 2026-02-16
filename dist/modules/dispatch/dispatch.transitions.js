"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchTransitions = void 0;
exports.dispatchTransitions = {
    PENDING: ["ASSIGNED", "CANCELLED"],
    ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};
//# sourceMappingURL=dispatch.transitions.js.map