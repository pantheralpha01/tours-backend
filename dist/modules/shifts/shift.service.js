"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftService = void 0;
const pagination_1 = require("../../utils/pagination");
const shift_repository_1 = require("./shift.repository");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
const AUTO_SHIFT_NOTE = "Auto-managed from booking";
const logShiftEvent = async (bookingId, actorId, metadata) => booking_event_repository_1.bookingEventRepository.create({
    bookingId,
    actorId,
    type: "UPDATED",
    metadata: {
        entity: "SHIFT",
        ...metadata,
    },
});
exports.shiftService = {
    create: (data) => shift_repository_1.shiftRepository.create(data),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            shift_repository_1.shiftRepository.findMany({
                skip,
                take: limit,
                agentId: params?.agentId,
                bookingId: params?.bookingId,
                startFrom: params?.startFrom,
                startTo: params?.startTo,
                status: params?.status,
                sort: params?.sort,
            }),
            shift_repository_1.shiftRepository.count({
                agentId: params?.agentId,
                bookingId: params?.bookingId,
                startFrom: params?.startFrom,
                startTo: params?.startTo,
                status: params?.status,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => shift_repository_1.shiftRepository.findById(id),
    update: (id, data) => shift_repository_1.shiftRepository.update(id, data),
    remove: (id) => shift_repository_1.shiftRepository.remove(id),
    syncWithBooking: async (input) => {
        const existing = await shift_repository_1.shiftRepository.findByBooking(input.bookingId);
        if (input.status === "CANCELLED") {
            if (existing && existing.status !== "CANCELLED") {
                const shift = await shift_repository_1.shiftRepository.update(existing.id, {
                    status: "CANCELLED",
                    notes: existing.notes ?? AUTO_SHIFT_NOTE,
                });
                await logShiftEvent(input.bookingId, input.actorId, {
                    action: "SHIFT_AUTO_CANCELLED",
                    shiftId: shift.id,
                    status: shift.status,
                    source: input.source,
                });
                return { action: "CANCELLED", shift };
            }
            return { action: "SKIPPED" };
        }
        if (input.status !== "CONFIRMED" || !input.startAt || !input.endAt) {
            return { action: "SKIPPED" };
        }
        if (!existing) {
            const shift = await shift_repository_1.shiftRepository.create({
                agentId: input.agentId,
                bookingId: input.bookingId,
                startAt: input.startAt,
                endAt: input.endAt,
                status: "SCHEDULED",
                notes: AUTO_SHIFT_NOTE,
            });
            await logShiftEvent(input.bookingId, input.actorId, {
                action: "SHIFT_AUTO_CREATED",
                shiftId: shift.id,
                startAt: shift.startAt,
                endAt: shift.endAt,
                status: shift.status,
                source: input.source,
            });
            return { action: "CREATED", shift };
        }
        const needsUpdate = existing.agentId !== input.agentId ||
            existing.startAt.getTime() !== input.startAt.getTime() ||
            existing.endAt.getTime() !== input.endAt.getTime() ||
            existing.status === "CANCELLED";
        if (!needsUpdate) {
            return { action: "UNCHANGED", shift: existing };
        }
        const shift = await shift_repository_1.shiftRepository.update(existing.id, {
            agentId: input.agentId,
            startAt: input.startAt,
            endAt: input.endAt,
            status: existing.status === "CANCELLED" ? "SCHEDULED" : existing.status,
            notes: existing.notes ?? AUTO_SHIFT_NOTE,
        });
        await logShiftEvent(input.bookingId, input.actorId, {
            action: "SHIFT_AUTO_UPDATED",
            shiftId: shift.id,
            startAt: shift.startAt,
            endAt: shift.endAt,
            status: shift.status,
            source: input.source,
        });
        return { action: "UPDATED", shift };
    },
};
//# sourceMappingURL=shift.service.js.map