"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTransitions = void 0;
exports.paymentTransitions = {
    INITIATED: ["PENDING", "CANCELLED", "FAILED"],
    PENDING: ["COMPLETED", "FAILED", "CANCELLED"],
    COMPLETED: [],
    FAILED: [],
    CANCELLED: [],
};
//# sourceMappingURL=payment.transitions.js.map