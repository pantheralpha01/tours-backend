"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingEventRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.bookingEventRepository = {
    create: (data) => prisma_1.prisma.bookingEvent.create({
        data: {
            bookingId: data.bookingId,
            type: data.type,
            actorId: data.actorId,
            metadata: (data.metadata || undefined),
        },
    }),
};
//# sourceMappingURL=booking-event.repository.js.map