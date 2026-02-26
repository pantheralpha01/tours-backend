import { EscrowReleaseStatus, PayoutStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { escrowRepository, payoutRepository } from "./escrow.repository";
import { bookingEventRepository } from "../bookings/booking-event.repository";

const toNumber = (value: unknown) =>
  typeof value === "number" ? value : Number(value ?? 0);

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const calculateReservedAmount = (
  payouts: Array<{ amount: unknown; status: PayoutStatus }>
) =>
  payouts
    .filter((payout) =>
      payout.status === "PENDING" || payout.status === "APPROVED"
    )
    .reduce((sum, payout) => sum + toNumber(payout.amount), 0);

export const extractReleaseAt = (metadata: unknown): Date | null => {
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

const deriveReleaseState = (
  account: NonNullable<Awaited<ReturnType<typeof escrowRepository.findByBooking>>>
) => {
  const payouts = account.payouts ?? [];
  const pending = payouts.filter(
    (payout) => payout.status === "PENDING" || payout.status === "APPROVED"
  );
  const sent = payouts.filter((payout) => payout.status === "SENT");
  const cancelled = payouts.filter((payout) => payout.status === "CANCELLED");

  if (pending.length > 0) {
    const nextDate = pending
      .map((payout) => extractReleaseAt(payout.metadata))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return {
      releaseStatus: "SCHEDULED" as EscrowReleaseStatus,
      releaseScheduledAt: nextDate ?? null,
      releasedAt: null,
    };
  }

  if (sent.length > 0) {
    return {
      releaseStatus: "RELEASED" as EscrowReleaseStatus,
      releaseScheduledAt: null,
      releasedAt: account.releasedAt ?? new Date(),
    };
  }

  if (cancelled.length > 0) {
    return {
      releaseStatus: "CANCELLED" as EscrowReleaseStatus,
      releaseScheduledAt: null,
      releasedAt: null,
    };
  }

  return {
    releaseStatus: "ON_HOLD" as EscrowReleaseStatus,
    releaseScheduledAt: null,
    releasedAt: null,
  };
};

const syncAccountState = async (bookingId: string) => {
  const account = await escrowRepository.findByBooking(bookingId);
  if (!account) {
    return null;
  }

  const state = deriveReleaseState(account);
  return escrowRepository.updateStatus(bookingId, state);
};

export const escrowService = {
  recordHold: async (data: {
    bookingId: string;
    amount: number;
    currency: "USD" | "KES";
    metadata?: Record<string, unknown>;
  }) => escrowRepository.upsertAccount(data),

  getByBooking: (bookingId: string) => escrowRepository.findByBooking(bookingId),

  scheduleRelease: async (data: {
    bookingId: string;
    amount: number;
    currency: "USD" | "KES";
    notes?: string;
    createdById?: string;
    releaseAt?: Date;
  }) => {
    const account = await escrowRepository.findByBooking(data.bookingId);
    if (!account) {
      throw ApiError.notFound("Escrow account not found");
    }

    if (data.amount <= 0) {
      throw ApiError.badRequest("Release amount must be positive");
    }

    const reservedAmount = calculateReservedAmount(account.payouts ?? []);
    const available = toNumber(account.totalAmount) - reservedAmount;
    if (available < data.amount) {
      throw ApiError.badRequest("Insufficient escrow balance");
    }

    const payout = await payoutRepository.create({
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

    await bookingEventRepository.create({
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
      return escrowService.updatePayoutStatus({
        bookingId: data.bookingId,
        payoutId: payout.id,
        status: "SENT",
        actorId: data.createdById,
        metadata: { trigger: "IMMEDIATE_RELEASE" },
      });
    }

    return payout;
  },

  updatePayoutStatus: async (data: {
    bookingId: string;
    payoutId: string;
    status: Extract<PayoutStatus, "APPROVED" | "SENT" | "CANCELLED">;
    actorId?: string;
    transactionReference?: string;
    notes?: string;
    metadata?: Record<string, unknown>;
  }) => {
    const payout = await payoutRepository.findById(data.payoutId);
    if (!payout || payout.bookingId !== data.bookingId) {
      throw ApiError.notFound("Payout not found for booking");
    }

    const previousStatus = payout.status;

    const transitions: Record<PayoutStatus, PayoutStatus[]> = {
      PENDING: ["APPROVED", "SENT", "CANCELLED"],
      APPROVED: ["SENT", "CANCELLED"],
      SENT: [],
      CANCELLED: [],
    };

    const allowedTargets = transitions[payout.status];
    if (!allowedTargets.includes(data.status)) {
      throw ApiError.badRequest("Invalid payout status transition");
    }

    const baseMetadata = asRecord(payout.metadata);
    const mergedMetadata: Record<string, unknown> = {
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

    const updated = await payoutRepository.update(data.payoutId, {
      status: data.status,
      notes: data.notes,
      metadata: mergedMetadata,
    });

    if (data.status === "SENT") {
      await escrowRepository.deductRelease(
        data.bookingId,
        toNumber(payout.amount)
      );
    }

    await syncAccountState(data.bookingId);

    await bookingEventRepository.create({
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

  cancelRelease: (bookingId: string) =>
    escrowRepository.updateStatus(bookingId, {
      releaseStatus: "CANCELLED",
      releaseScheduledAt: null,
    }),
};
