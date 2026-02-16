"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingTransitions = void 0;
exports.bookingTransitions = {
    DRAFT: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CANCELLED"],
    CANCELLED: [],
};
//# sourceMappingURL=booking.transitions.js.map