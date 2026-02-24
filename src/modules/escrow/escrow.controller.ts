import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { escrowService } from "./escrow.service";
import {
  bookingParamSchema,
  escrowReleaseSchema,
  payoutParamSchema,
  payoutStatusSchema,
} from "./escrow.validation";

export const escrowController = {
  getByBooking: async (req: Request, res: Response) => {
    const { bookingId } = bookingParamSchema.parse(req.params);
    const account = await escrowService.getByBooking(bookingId);
    if (!account) {
      return res.status(404).json({ message: "Escrow account not found" });
    }

    if (req.user?.role === "AGENT" && account.booking.agentId !== req.user.id) {
      throw ApiError.forbidden("Insufficient permissions");
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

  release: async (req: Request, res: Response) => {
    const { bookingId } = bookingParamSchema.parse(req.params);
    const payload = escrowReleaseSchema.parse(req.body);

    const payout = await escrowService.scheduleRelease({
      bookingId,
      amount: payload.amount,
      currency: payload.currency,
      notes: payload.notes,
      releaseAt: payload.releaseAt,
      createdById: req.user?.id,
    });

    return res.status(201).json(payout);
  },

  updatePayoutStatus: async (req: Request, res: Response) => {
    const params = payoutParamSchema.parse(req.params);
    const payload = payoutStatusSchema.parse(req.body);

    const payout = await escrowService.updatePayoutStatus({
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

  cancel: async (req: Request, res: Response) => {
    const { bookingId } = bookingParamSchema.parse(req.params);
    await escrowService.cancelRelease(bookingId);
    return res.status(200).json({ status: "cancelled" });
  },
};
