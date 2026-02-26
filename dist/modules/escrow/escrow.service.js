"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowService = exports.extractReleaseAt = void 0;
const ApiError_1 = require("../../utils/ApiError");
const escrow_repository_1 = require("./escrow.repository");
const booking_event_repository_1 = require("../bookings/booking-event.repository");
const toNumber = (value) => typeof value === "number" ? value : Number(value ?? 0);
const asRecord = (value) => value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
const calculateReservedAmount = (payouts) => payouts
    .filter((payout) => payout.status === "PENDING" || payout.status === "APPROVED")
    .reduce((sum, payout) => sum + toNumber(payout.amount), 0);
const extractReleaseAt = (metadata) => {
    const record = asRecord(metadata);
    const candidate = record.releaseAt;
    if (typeof candidate === "string") {
        const parsed = new Date(candidate);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    if (candidate instanceof Date) {
        return candidate;
    }
    return null;
};
exports.extractReleaseAt = extractReleaseAt;
const deriveReleaseState = (account) => {
    const payouts = account.payouts ?? [];
    const pending = payouts.filter((payout) => payout.status === "PENDING" || payout.status === "APPROVED");
    const sent = payouts.filter((payout) => payout.status === "SENT");
    const cancelled = payouts.filter((payout) => payout.status === "CANCELLED");
    if (pending.length > 0) {
        const nextDate = pending
            .map((payout) => (0, exports.extractReleaseAt)(payout.metadata))
            .filter((date) => Boolean(date))
            .sort((a, b) => a.getTime() - b.getTime())[0];
        return {
            releaseStatus: "SCHEDULED",
            releaseScheduledAt: nextDate ?? null,
            releasedAt: null,
        };
    }
    if (sent.length > 0) {
        return {
            releaseStatus: "RELEASED",
            releaseScheduledAt: null,
            releasedAt: account.releasedAt ?? new Date(),
        };
    }
    if (cancelled.length > 0) {
        return {
            releaseStatus: "CANCELLED",
            releaseScheduledAt: null,
            releasedAt: null,
        };
    }
    return {
        releaseStatus: "ON_HOLD",
        releaseScheduledAt: null,
        releasedAt: null,
    };
};
const syncAccountState = async (bookingId) => {
    const account = await escrow_repository_1.escrowRepository.findByBooking(bookingId);
    if (!account) {
        return null;
    }
    const state = deriveReleaseState(account);
    return escrow_repository_1.escrowRepository.updateStatus(bookingId, state);
};
exports.escrowService = {
    recordHold: async (data) => escrow_repository_1.escrowRepository.upsertAccount(data),
    getByBooking: (bookingId) => escrow_repository_1.escrowRepository.findByBooking(bookingId),
    scheduleRelease: async (data) => {
        const account = await escrow_repository_1.escrowRepository.findByBooking(data.bookingId);
        if (!account) {
            throw ApiError_1.ApiError.notFound("Escrow account not found");
        }
        if (data.amount <= 0) {
            throw ApiError_1.ApiError.badRequest("Release amount must be positive");
        }
        const reservedAmount = calculateReservedAmount(account.payouts ?? []);
        const available = toNumber(account.totalAmount) - reservedAmount;
        if (available < data.amount) {
            throw ApiError_1.ApiError.badRequest("Insufficient escrow balance");
        }
        const payout = await escrow_repository_1.payoutRepository.create({
            bookingId: data.bookingId,
            escrowAccountId: account.id,
            amount: data.amount,
            currency: data.currency,
            notes: data.notes,
            createdById: data.createdById,
            metadata: {
                releaseAt: data.releaseAt ? data.releaseAt.toISOString() : undefined,
                releaseRequestedBy: data.createdById,
            },
        });
        await syncAccountState(data.bookingId);
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: data.bookingId,
            type: "UPDATED",
            actorId: data.createdById,
            metadata: {
                entity: "ESCROW_PAYOUT",
                action: data.releaseAt ? "SCHEDULED" : "RELEASE_REQUESTED",
                payoutId: payout.id,
                releaseAt: data.releaseAt?.toISOString(),
                amount: payout.amount.toString(),
                currency: payout.currency,
            },
        });
        if (!data.releaseAt) {
            return exports.escrowService.updatePayoutStatus({
                bookingId: data.bookingId,
                payoutId: payout.id,
                status: "SENT",
                actorId: data.createdById,
                metadata: { trigger: "IMMEDIATE_RELEASE" },
            });
        }
        return payout;
    },
    updatePayoutStatus: async (data) => {
        const payout = await escrow_repository_1.payoutRepository.findById(data.payoutId);
        if (!payout || payout.bookingId !== data.bookingId) {
            throw ApiError_1.ApiError.notFound("Payout not found for booking");
        }
        const previousStatus = payout.status;
        const transitions = {
            PENDING: ["APPROVED", "SENT", "CANCELLED"],
            APPROVED: ["SENT", "CANCELLED"],
            SENT: [],
            CANCELLED: [],
        };
        const allowedTargets = transitions[payout.status];
        if (!allowedTargets.includes(data.status)) {
            throw ApiError_1.ApiError.badRequest("Invalid payout status transition");
        }
        const baseMetadata = asRecord(payout.metadata);
        const mergedMetadata = {
            ...baseMetadata,
            ...(data.metadata ?? {}),
            lastStatus: data.status,
            lastUpdatedAt: new Date().toISOString(),
        };
        if (data.actorId) {
            mergedMetadata.lastUpdatedBy = data.actorId;
        }
        if (data.transactionReference) {
            mergedMetadata.transactionReference = data.transactionReference;
        }
        const updated = await escrow_repository_1.payoutRepository.update(data.payoutId, {
            status: data.status,
            notes: data.notes,
            metadata: mergedMetadata,
        });
        if (data.status === "SENT") {
            await escrow_repository_1.escrowRepository.deductRelease(data.bookingId, toNumber(payout.amount));
        }
        await syncAccountState(data.bookingId);
        await booking_event_repository_1.bookingEventRepository.create({
            bookingId: payout.bookingId,
            type: "UPDATED",
            actorId: data.actorId,
            metadata: {
                entity: "ESCROW_PAYOUT",
                payoutId: payout.id,
                fromStatus: previousStatus,
                toStatus: data.status,
                amount: payout.amount.toString(),
                currency: payout.currency,
                trigger: typeof data.metadata?.trigger === 'object' || typeof data.metadata?.trigger === 'string' ? data.metadata?.trigger : null,
                transactionReference: data.transactionReference,
            },
        });
        return updated;
    },
    cancelRelease: (bookingId) => escrow_repository_1.escrowRepository.updateStatus(bookingId, {
        releaseStatus: "CANCELLED",
        releaseScheduledAt: null,
    }),
};
//# sourceMappingURL=escrow.service.js.map