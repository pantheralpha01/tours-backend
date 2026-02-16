"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatusRules = void 0;
const validateStatusRules = (current, next) => {
    const nextStatus = next.status ?? current.status;
    const nextPayment = next.paymentStatus ?? current.paymentStatus;
    if (nextPayment === "PAID" && nextStatus !== "CONFIRMED") {
        throw new Error("Payment can only be marked PAID for CONFIRMED bookings");
    }
    if (nextStatus === "CANCELLED" && nextPayment === "PAID") {
        throw new Error("Cancelled bookings cannot be PAID");
    }
};
exports.validateStatusRules = validateStatusRules;
//# sourceMappingURL=booking.rules.js.map