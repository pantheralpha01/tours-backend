"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidTransition = exports.allowedTransitions = void 0;
exports.allowedTransitions = {
    DRAFT: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CANCELLED"],
    CANCELLED: [],
};
const assertValidTransition = (from, to) => {
    const allowed = exports.allowedTransitions[from] ?? [];
    if (!allowed.includes(to)) {
        throw new Error(`Invalid status transition from ${from} to ${to}`);
    }
};
exports.assertValidTransition = assertValidTransition;
//# sourceMappingURL=booking.lifecycle.js.map