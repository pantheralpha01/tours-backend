"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowController = void 0;
const ApiError_1 = require("../../utils/ApiError");
const escrow_service_1 = require("./escrow.service");
const escrow_validation_1 = require("./escrow.validation");
exports.escrowController = {
    getByBooking: async (req, res) => {
        const { bookingId } = escrow_validation_1.bookingParamSchema.parse(req.params);
        const account = await escrow_service_1.escrowService.getByBooking(bookingId);
        if (!account) {
            return res.status(404).json({ message: "Escrow account not found" });
        }
        if (req.user?.role === "AGENT" && account.booking.agentId !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
        }
        const { booking, payouts, ...rest } = account;
        return res.status(200).json({
            ...rest,
            booking: {
                id: booking.id,
                agentId: booking.agentId,
                status: booking.status,
            },
            payouts,
        });
    },
    release: async (req, res) => {
        const { bookingId } = escrow_validation_1.bookingParamSchema.parse(req.params);
        const payload = escrow_validation_1.escrowReleaseSchema.parse(req.body);
        const payout = await escrow_service_1.escrowService.scheduleRelease({
            bookingId,
            amount: payload.amount,
            currency: payload.currency,
            notes: payload.notes,
            releaseAt: payload.releaseAt,
            createdById: req.user?.id,
        });
        return res.status(201).json(payout);
    },
    updatePayoutStatus: async (req, res) => {
        const params = escrow_validation_1.payoutParamSchema.parse(req.params);
        const payload = escrow_validation_1.payoutStatusSchema.parse(req.body);
        const payout = await escrow_service_1.escrowService.updatePayoutStatus({
            bookingId: params.bookingId,
            payoutId: params.payoutId,
            status: payload.status,
            transactionReference: payload.transactionReference,
            notes: payload.notes,
            metadata: payload.metadata,
            actorId: req.user?.id,
        });
        return res.status(200).json(payout);
    },
    cancel: async (req, res) => {
        const { bookingId } = escrow_validation_1.bookingParamSchema.parse(req.params);
        await escrow_service_1.escrowService.cancelRelease(bookingId);
        return res.status(200).json({ status: "cancelled" });
    },
};
//# sourceMappingURL=escrow.controller.js.map