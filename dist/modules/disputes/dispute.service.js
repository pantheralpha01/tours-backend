"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeService = void 0;
const dispute_repository_1 = require("./dispute.repository");
const pagination_1 = require("../../utils/pagination");
const stateMachine_1 = require("../../utils/stateMachine");
const dispute_transitions_1 = require("./dispute.transitions");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
exports.disputeService = {
    create: (data) => dispute_repository_1.disputeRepository.create(data),
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            dispute_repository_1.disputeRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
                bookingId: params?.bookingId,
                openedById: params?.openedById,
                assignedToId: params?.assignedToId,
            }),
            dispute_repository_1.disputeRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                bookingId: params?.bookingId,
                openedById: params?.openedById,
                assignedToId: params?.assignedToId,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => dispute_repository_1.disputeRepository.findById(id),
    update: async (id, data) => {
        const current = await dispute_repository_1.disputeRepository.findById(id);
        if (!current) {
            throw new Error("Dispute not found");
        }
        if (data.status) {
            (0, stateMachine_1.assertTransition)({
                entity: "dispute",
                currentState: current.status,
                targetState: data.status,
                transitions: dispute_transitions_1.disputeTransitions,
            });
        }
        // Filter out fields that don't exist in the Dispute model
        const { transitionReason, ...updateData } = data;
        const updated = await dispute_repository_1.disputeRepository.update(id, updateData);
        if (data.status && data.status !== current.status) {
            await booking_event_repository_1.bookingEventRepository.create({
                bookingId: current.bookingId,
                type: "UPDATED",
                metadata: {
                    entity: "DISPUTE",
                    disputeId: current.id,
                    fromStatus: current.status,
                    toStatus: data.status,
                    reason: data.transitionReason,
                },
            });
        }
        return updated;
    },
    remove: (id) => dispute_repository_1.disputeRepository.remove(id),
};
//# sourceMappingURL=dispute.service.js.map