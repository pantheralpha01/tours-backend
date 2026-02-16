"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundService = void 0;
const refund_repository_1 = require("./refund.repository");
const pagination_1 = require("../../utils/pagination");
const stateMachine_1 = require("../../utils/stateMachine");
const refund_transitions_1 = require("./refund.transitions");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
exports.refundService = {
    create: (data) => refund_repository_1.refundRepository.create({
        ...data,
        currency: data.currency ?? "USD",
    }),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            refund_repository_1.refundRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                bookingId: params?.bookingId,
                paymentId: params?.paymentId,
            }),
            refund_repository_1.refundRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                bookingId: params?.bookingId,
                paymentId: params?.paymentId,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => refund_repository_1.refundRepository.findById(id),
    update: async (id, data) => {
        const current = await refund_repository_1.refundRepository.findById(id);
        if (!current) {
            throw new Error("Refund not found");
        }
        if (data.status) {
            (0, stateMachine_1.assertTransition)({
                entity: "refund",
                currentState: current.status,
                targetState: data.status,
                transitions: refund_transitions_1.refundTransitions,
            });
        }
        // Filter out fields that don't exist in the Refund model
        const { transitionReason, ...updateData } = data;
        const updated = await refund_repository_1.refundRepository.update(id, updateData);
        if (data.status && data.status !== current.status) {
            await booking_event_repository_1.bookingEventRepository.create({
                bookingId: current.bookingId,
                type: "UPDATED",
                metadata: {
                    entity: "REFUND",
                    refundId: current.id,
                    fromStatus: current.status,
                    toStatus: data.status,
                    reason: data.transitionReason,
                },
            });
        }
        return updated;
    },
    remove: (id) => refund_repository_1.refundRepository.remove(id),
};
//# sourceMappingURL=refund.service.js.map