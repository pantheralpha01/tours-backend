import { EscrowReleaseStatus, PayoutStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const escrowRepository = {
  upsertAccount: async (data: {
    bookingId: string;
    amount: number;
    currency: "USD" | "KES";
    metadata?: Record<string, unknown>;
  }) =>
    prisma.escrowAccount.upsert({
      where: { bookingId: data.bookingId },
      update: {
        totalAmount: { increment: data.amount },
        currency: data.currency,
        metadata: data.metadata ? (data.metadata as any) : undefined,
      },
      create: {
        bookingId: data.bookingId,
        totalAmount: data.amount,
        currency: data.currency,
        metadata: data.metadata ? (data.metadata as any) : undefined,
      },
      include: { booking: true },
    }),

  findByBooking: (bookingId: string) =>
    prisma.escrowAccount.findUnique({
      where: { bookingId },
      include: { booking: true, payouts: true },
    }),

  findDueReleases: (params?: { limit?: number }) =>
    prisma.escrowAccount.findMany({
      where: {
        releaseStatus: "SCHEDULED",
        releaseScheduledAt: { lte: new Date() },
      },
      include: { booking: true, payouts: true },
      orderBy: { releaseScheduledAt: "asc" },
      take: params?.limit,
    }),

  updateStatus: (
    bookingId: string,
    data: {
      releaseStatus?: EscrowReleaseStatus;
      releaseScheduledAt?: Date | null;
      releasedAt?: Date | null;
      metadata?: Record<string, unknown> | null;
    }
  ) =>
    prisma.escrowAccount.update({
      where: { bookingId },
      data: {
        releaseStatus: data.releaseStatus,
        releaseScheduledAt: data.releaseScheduledAt,
        releasedAt: data.releasedAt,
        metadata:
          data.metadata === undefined ? undefined : (data.metadata as any),
      },
    }),

  deductRelease: (bookingId: string, amount: number) =>
    prisma.escrowAccount.update({
      where: { bookingId },
      data: {
        releasedAmount: { increment: amount },
        totalAmount: { decrement: amount },
      },
    }),
};

export const payoutRepository = {
  create: (data: {
    bookingId: string;
    escrowAccountId: string;
    amount: number;
    currency: "USD" | "KES";
    status?: PayoutStatus;
    notes?: string | null;
    createdById?: string | null;
    metadata?: Record<string, unknown> | null;
  }) =>
    prisma.payout.create({
      data: {
        bookingId: data.bookingId,
        escrowAccountId: data.escrowAccountId,
        amount: data.amount,
        currency: data.currency,
        status: data.status ?? "PENDING",
        notes: data.notes ?? undefined,
        createdById: data.createdById ?? undefined,
        metadata:
          data.metadata === undefined ? undefined : (data.metadata as any),
      },
      include: { booking: true, escrowAccount: true },
    }),

  findMany: (bookingId: string) =>
    prisma.payout.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.payout.findUnique({
      where: { id },
      include: { booking: true, escrowAccount: true },
    }),

  update: (
    id: string,
    data: {
      status?: PayoutStatus;
      notes?: string | null;
      metadata?: Record<string, unknown> | null;
    }
  ) =>
    prisma.payout.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes ?? undefined,
        metadata:
          data.metadata === undefined ? undefined : (data.metadata as any),
      },
      include: { booking: true, escrowAccount: true },
    }),
};
