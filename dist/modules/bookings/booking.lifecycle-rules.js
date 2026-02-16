"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingLifecycleRules = void 0;
exports.bookingLifecycleRules = {
    canConfirm: (booking) => {
        if (booking.status !== "DRAFT") {
            throw new Error("Can only confirm bookings in DRAFT status");
        }
        if (booking.paymentStatus !== "PAID") {
            throw new Error("Cannot confirm booking without payment");
        }
    },
    canCancel: (booking) => {
        if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") {
            throw new Error("Cannot cancel a paid booking");
        }
    },
    canMarkComplete: (booking) => {
        if (booking.status !== "CONFIRMED") {
            throw new Error("Can only complete CONFIRMED bookings");
        }
    },
};
//# sourceMappingURL=booking.lifecycle-rules.js.map