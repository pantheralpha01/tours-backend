"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeTransitions = void 0;
exports.disputeTransitions = {
    OPEN: ["UNDER_REVIEW", "RESOLVED", "REJECTED"],
    UNDER_REVIEW: ["RESOLVED", "REJECTED"],
    RESOLVED: [],
    REJECTED: [],
};
//# sourceMappingURL=dispute.transitions.js.map