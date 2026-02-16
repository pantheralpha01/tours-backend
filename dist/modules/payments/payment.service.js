"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const payment_repository_1 = require("./payment.repository");
const payment_helpers_1 = require("./payment.helpers");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
const pagination_1 = require("../../utils/pagination");
const stateMachine_1 = require("../../utils/stateMachine");
const payment_transitions_1 = require("./payment.transitions");
exports.paymentService = {
    create: async (data) => {
        await payment_helpers_1.paymentHelpers.canAddPayment(data.bookingId);
        const payment = await payment_repository_1.paymentRepository.create(data);
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: data.bookingId,
            type: "PAYMENT_CREATED",
            metadata: {
                paymentId: payment.id,
                provider: payment.provider,
                amount: payment.amount.toString(),
            },
        });
        return payment;
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            payment_repository_1.paymentRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
            }),
            payment_repository_1.paymentRepository.count({
                status: params?.status,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => payment_repository_1.paymentRepository.findById(id),
    update: async (id, data) => {
        const payment = await payment_repository_1.paymentRepository.findById(id);
        if (!payment) {
            throw new Error("Payment not found");
        }
        if (data.state) {
            (0, stateMachine_1.assertTransition)({
                entity: "payment",
                currentState: payment.state,
                targetState: data.state,
                transitions: payment_transitions_1.paymentTransitions,
            });
        }
        // Filter out fields that don't exist in the Payment model
        const { transitionReason, ...updateData } = data;
        const updatedPayment = await payment_repository_1.paymentRepository.update(id, updateData);
        if (data.state && data.state !== payment.state) {
            await booking_event_repository_1.bookingEventRepository.create({
                bookingId: payment.bookingId,
                type: "UPDATED",
                metadata: {
                    entity: "PAYMENT",
                    paymentId: payment.id,
                    fromState: payment.state,
                    toState: data.state,
                    reason: data.transitionReason,
                },
            });
        }
        if (data.state === "COMPLETED") {
            const newPaymentStatus = await payment_helpers_1.paymentHelpers.syncPaymentStatus(payment.bookingId);
            await booking_event_repository_1.bookingEventRepository.create({
                bookingId: payment.bookingId,
                type: "PAYMENT_COMPLETED",
                metadata: {
                    paymentId: payment.id,
                    bookingPaymentStatus: newPaymentStatus,
                    reason: data.transitionReason,
                },
            });
        }
        else if (data.state === "FAILED") {
            await booking_event_repository_1.bookingEventRepository.create({
                bookingId: payment.bookingId,
                type: "PAYMENT_FAILED",
                metadata: {
                    paymentId: payment.id,
                    reason: data.transitionReason ?? data.metadata?.reason ?? "Unknown",
                },
            });
        }
        return updatedPayment;
    },
    remove: (id) => payment_repository_1.paymentRepository.remove(id),
};
//# sourceMappingURL=payment.service.js.map