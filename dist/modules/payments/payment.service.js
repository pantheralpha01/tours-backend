"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const payment_repository_1 = require("./payment.repository");
const payment_helpers_1 = require("./payment.helpers");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
const pagination_1 = require("../../utils/pagination");
const stateMachine_1 = require("../../utils/stateMachine");
const payment_transitions_1 = require("./payment.transitions");
const payment_gateway_1 = require("../../integrations/payment-gateway");
const escrow_service_1 = require("../escrow/escrow.service");
const toNumber = (value) => typeof value === "number" ? value : Number(value);
const toRecord = (value) => value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
const mapExternalStatus = (status) => {
    const normalized = status.toUpperCase();
    if (["COMPLETED", "SUCCESS", "SUCCESSFUL", "PAID", "CAPTURED"].includes(normalized)) {
        return "COMPLETED";
    }
    if (["PENDING", "PROCESSING", "REQUIRES_ACTION", "AUTHORIZED"].includes(normalized)) {
        return "PENDING";
    }
    if (["FAILED", "DECLINED", "ERROR", "EXPIRED"].includes(normalized)) {
        return "FAILED";
    }
    if (["CANCELLED", "CANCELED", "VOIDED"].includes(normalized)) {
        return "CANCELLED";
    }
    return null;
};
exports.paymentService = {
    create: async (data) => {
        await payment_helpers_1.paymentHelpers.canAddPayment(data.bookingId);
        const payment = await payment_repository_1.paymentRepository.create({
            bookingId: data.bookingId,
            provider: data.provider,
            amount: data.amount,
            currency: data.currency,
            reference: data.reference,
            metadata: data.metadata,
            state: data.state,
            recordedById: data.actorId,
        });
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: data.bookingId,
            type: "PAYMENT_CREATED",
            metadata: {
                paymentId: payment.id,
                provider: payment.provider,
                amount: payment.amount.toString(),
            },
        });
        if (payment.state === "COMPLETED") {
            await escrow_service_1.escrowService.recordHold({
                bookingId: payment.bookingId,
                amount: toNumber(payment.amount),
                currency: payment.currency,
                metadata: { source: "CREATE_ENDPOINT" },
            });
        }
        return payment;
    },
    initiate: async (data) => {
        await payment_helpers_1.paymentHelpers.canAddPayment(data.bookingId);
        const currency = data.currency ?? "USD";
        const intent = await payment_gateway_1.paymentGatewayService.createIntent({
            provider: data.provider,
            amount: data.amount,
            currency,
            reference: data.reference,
            metadata: data.metadata,
        });
        const payment = await payment_repository_1.paymentRepository.create({
            bookingId: data.bookingId,
            provider: data.provider,
            amount: data.amount,
            currency,
            reference: intent.reference,
            metadata: {
                ...(data.metadata ?? {}),
                intent,
                mode: "GATEWAY",
            },
            state: "INITIATED",
            recordedById: data.actorId,
        });
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: data.bookingId,
            type: "PAYMENT_CREATED",
            metadata: {
                paymentId: payment.id,
                provider: payment.provider,
                amount: payment.amount.toString(),
                mode: "GATEWAY",
                intentReference: intent.reference,
            },
        });
        return { payment, intent };
    },
    registerManual: async (data) => {
        await payment_helpers_1.paymentHelpers.canAddPayment(data.bookingId);
        const currency = data.currency ?? "USD";
        const targetState = data.state ?? "COMPLETED";
        const recordedAt = data.recordedAt ?? new Date();
        const metadata = {
            ...(data.metadata ?? {}),
            mode: "MANUAL",
            notes: data.notes,
            recordedAt: recordedAt.toISOString(),
        };
        const payment = await payment_repository_1.paymentRepository.create({
            bookingId: data.bookingId,
            provider: data.provider,
            amount: data.amount,
            currency,
            reference: data.reference,
            metadata,
            state: targetState,
            recordedById: data.actorId,
        });
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: data.bookingId,
            type: "PAYMENT_COMPLETED",
            metadata: {
                paymentId: payment.id,
                provider: payment.provider,
                amount: payment.amount.toString(),
                mode: "MANUAL",
                recordedAt: recordedAt.toISOString(),
            },
        });
        await payment_helpers_1.paymentHelpers.syncPaymentStatus(data.bookingId);
        await escrow_service_1.escrowService.recordHold({
            bookingId: payment.bookingId,
            amount: toNumber(payment.amount),
            currency: payment.currency,
            metadata: { source: "MANUAL" },
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
        const { transitionReason: _transitionReason, ...updateData } = data;
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
            await escrow_service_1.escrowService.recordHold({
                bookingId: payment.bookingId,
                amount: toNumber(updatedPayment.amount),
                currency: updatedPayment.currency,
                metadata: { source: "STATE_UPDATE" },
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
    processWebhookEvent: async (data) => {
        const payment = await payment_repository_1.paymentRepository.findByReference(data.reference);
        if (!payment) {
            console.warn(`[payments] webhook ignored – payment not found for reference ${data.reference}`);
            return { handled: false, reason: "NOT_FOUND" };
        }
        const currentMetadata = toRecord(payment.metadata);
        const existingLogs = Array.isArray(currentMetadata["webhookLogs"])
            ? currentMetadata["webhookLogs"]
            : [];
        const existingProcessed = Array.isArray(currentMetadata["processedWebhookEventIds"])
            ? currentMetadata["processedWebhookEventIds"]
                .filter((entry) => typeof entry === "string")
            : [];
        const isDuplicate = Boolean(data.eventId && existingProcessed.includes(data.eventId));
        const webhookSnapshot = {
            provider: data.provider,
            status: data.status,
            eventType: data.eventType,
            amount: data.amount,
            currency: data.currency,
            receivedAt: new Date().toISOString(),
            metadata: data.metadata,
            rawPayload: data.rawPayload,
            headers: data.headers,
            eventId: data.eventId,
            reason: data.reason,
            duplicate: isDuplicate,
        };
        const webhookLogs = [...existingLogs.slice(-9), webhookSnapshot];
        const processedWebhookEventIds = data.eventId && !isDuplicate
            ? [...existingProcessed.slice(-19), data.eventId]
            : existingProcessed;
        const mergedMetadata = {
            ...currentMetadata,
            webhookLogs,
            lastWebhook: webhookSnapshot,
            processedWebhookEventIds,
        };
        const targetState = mapExternalStatus(data.status);
        const transitionReason = `WEBHOOK:${data.provider}:${data.eventType ?? data.status}`;
        if (data.amount && toNumber(payment.amount) !== data.amount) {
            mergedMetadata.amountMismatch = {
                reported: data.amount,
                recorded: toNumber(payment.amount),
            };
        }
        const updatePayload = {
            metadata: mergedMetadata,
        };
        if (targetState && targetState !== payment.state) {
            updatePayload.state = targetState;
            updatePayload.transitionReason = transitionReason;
        }
        await exports.paymentService.update(payment.id, updatePayload);
        return {
            handled: true,
            paymentId: payment.id,
            targetState: updatePayload.state ?? payment.state,
            duplicate: isDuplicate,
        };
    },
    remove: (id) => payment_repository_1.paymentRepository.remove(id),
};
//# sourceMappingURL=payment.service.js.map