"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const booking_repository_1 = require("./booking.repository");
const booking_event_repository_1 = require("./booking-event.repository");
const booking_constants_1 = require("./booking.constants");
const stateMachine_1 = require("../../utils/stateMachine");
const booking_transitions_1 = require("./booking.transitions");
const booking_rules_1 = require("./booking.rules");
const booking_lifecycle_rules_1 = require("./booking.lifecycle-rules");
const pagination_1 = require("../../utils/pagination");
exports.bookingService = {
    create: async (data) => {
        (0, booking_rules_1.validateStatusRules)({
            status: "DRAFT",
            paymentStatus: "UNPAID",
        }, {
            status: data.status,
            paymentStatus: data.paymentStatus,
        });
        const currency = data.currency ?? "USD";
        const commissionAmount = (0, booking_constants_1.calculateCommission)(data.amount);
        // Commission is always in KES (provider currency)
        const commissionInKes = currency === "USD"
            ? (0, booking_constants_1.convertUsdToKes)(commissionAmount)
            : commissionAmount;
        const booking = await booking_repository_1.bookingRepository.create({
            ...data,
            currency,
            commissionRate: booking_constants_1.BOOKING_COMMISSION_RATE.toString(),
            commissionAmount: commissionInKes.toString(),
            commissionCurrency: "KES",
        });
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: booking.id,
            type: "CREATED",
            actorId: data.actorId,
            metadata: {
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                amount: booking.amount.toString(),
                currency: booking.currency,
            },
        });
        return booking;
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            booking_repository_1.bookingRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                agentId: params?.agentId,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                serviceStartFrom: params?.serviceStartFrom,
                serviceStartTo: params?.serviceStartTo,
                sort: params?.sort,
            }),
            booking_repository_1.bookingRepository.count({
                status: params?.status,
                agentId: params?.agentId,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                serviceStartFrom: params?.serviceStartFrom,
                serviceStartTo: params?.serviceStartTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => booking_repository_1.bookingRepository.findById(id),
    update: async (id, data) => {
        const current = await booking_repository_1.bookingRepository.findById(id);
        if (!current) {
            throw new Error("Booking not found");
        }
        if (data.status) {
            (0, stateMachine_1.assertTransition)({
                entity: "booking",
                currentState: current.status,
                targetState: data.status,
                transitions: booking_transitions_1.bookingTransitions,
            });
        }
        (0, booking_rules_1.validateStatusRules)({
            status: current.status,
            paymentStatus: current.paymentStatus,
        }, data);
        let commissionAmount;
        let commissionCurrency;
        if (typeof data.amount === "number") {
            const commission = (0, booking_constants_1.calculateCommission)(data.amount);
            const currency = data.currency ?? current.currency;
            commissionAmount = (currency === "USD"
                ? (0, booking_constants_1.convertUsdToKes)(commission)
                : commission).toString();
            commissionCurrency = "KES";
        }
        const booking = await booking_repository_1.bookingRepository.update(id, {
            ...data,
            commissionAmount,
            commissionCurrency,
        });
        const eventType = data.status ? "STATUS_CHANGED" : "UPDATED";
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: booking.id,
            type: eventType,
            actorId: data.actorId,
            metadata: {
                fromStatus: current.status,
                toStatus: data.status ?? current.status,
                reason: data.transitionReason,
            },
        });
        return booking;
    },
    transitionStatus: async (data) => {
        const current = await booking_repository_1.bookingRepository.findById(data.id);
        if (!current) {
            throw new Error("Booking not found");
        }
        (0, stateMachine_1.assertTransition)({
            entity: "booking",
            currentState: current.status,
            targetState: data.toStatus,
            transitions: booking_transitions_1.bookingTransitions,
        });
        if (data.toStatus === "CONFIRMED") {
            booking_lifecycle_rules_1.bookingLifecycleRules.canConfirm({
                status: current.status,
                paymentStatus: current.paymentStatus,
            });
        }
        else if (data.toStatus === "CANCELLED") {
            booking_lifecycle_rules_1.bookingLifecycleRules.canCancel({
                status: current.status,
                paymentStatus: current.paymentStatus,
            });
        }
        (0, booking_rules_1.validateStatusRules)({
            status: current.status,
            paymentStatus: current.paymentStatus,
        }, { status: data.toStatus });
        const booking = await booking_repository_1.bookingRepository.update(data.id, {
            status: data.toStatus,
        });
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: booking.id,
            type: "STATUS_CHANGED",
            actorId: data.actorId,
            metadata: {
                fromStatus: current.status,
                toStatus: booking.status,
                reason: data.transitionReason,
            },
        });
        return booking;
    },
    remove: (id) => booking_repository_1.bookingRepository.remove(id),
};
//# sourceMappingURL=booking.service.js.map