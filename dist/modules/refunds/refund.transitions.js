"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundTransitions = void 0;
exports.refundTransitions = {
    REQUESTED: ["APPROVED", "DECLINED"],
    APPROVED: ["PROCESSING"],
    PROCESSING: ["COMPLETED", "FAILED"],
    COMPLETED: [],
    FAILED: [],
    DECLINED: [],
};
//# sourceMappingURL=refund.transitions.js.map