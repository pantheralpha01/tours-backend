"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingLifecycleRules = void 0;
const ApiError_1 = require("../../utils/ApiError");
exports.bookingLifecycleRules = {
    canConfirm: (booking) => {
        if (booking.status !== "DRAFT") {
            throw ApiError_1.ApiError.badRequest("Can only confirm bookings in DRAFT status");
        }
        if (booking.paymentStatus !== "PAID") {
            throw ApiError_1.ApiError.badRequest("Cannot confirm booking without payment");
        }
    },
    canCancel: (booking) => {
        if (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") {
            throw ApiError_1.ApiError.badRequest("Cannot cancel a paid booking");
        }
    },
    canMarkComplete: (booking) => {
        if (booking.status !== "CONFIRMED") {
            throw ApiError_1.ApiError.badRequest("Can only complete CONFIRMED bookings");
        }
    },
};
//# sourceMappingURL=booking.lifecycle-rules.js.map