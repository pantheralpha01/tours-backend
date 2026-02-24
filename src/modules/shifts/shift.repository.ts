import { ShiftStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const shiftRepository = {
  create: (data: {
    agentId: string;
    bookingId?: string | null;
    startAt: Date;
    endAt: Date;
    status?: ShiftStatus;
    notes?: string | null;
  }) =>
    prisma.agentShift.create({
      data: {
        agentId: data.agentId,
        bookingId: data.bookingId ?? undefined,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status ?? "SCHEDULED",
        notes: data.notes ?? undefined,
      },
      include: { agent: true, booking: true },
    }),

  findByBooking: (bookingId: string) =>
    prisma.agentShift.findFirst({
      where: { bookingId },
      orderBy: { createdAt: "asc" },
      include: { agent: true, booking: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    agentId?: string;
    bookingId?: string;
    startFrom?: Date;
    startTo?: Date;
    status?: ShiftStatus;
    sort?: "asc" | "desc";
  }) => {
    const where: Record<string, unknown> = {};

    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.startFrom || params?.startTo) {
      where.startAt = {
        ...(params.startFrom ? { gte: params.startFrom } : {}),
        ...(params.startTo ? { lte: params.startTo } : {}),
      };
    }

    return prisma.agentShift.findMany({
      where,
      orderBy: { startAt: params?.sort ?? "asc" },
      skip: params?.skip,
      take: params?.take,
      include: { agent: true, booking: true },
    });
  },

  count: (params?: {
    agentId?: string;
    bookingId?: string;
    startFrom?: Date;
    startTo?: Date;
    status?: ShiftStatus;
  }) => {
    const where: Record<string, unknown> = {};

    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.startFrom || params?.startTo) {
      where.startAt = {
        ...(params.startFrom ? { gte: params.startFrom } : {}),
        ...(params.startTo ? { lte: params.startTo } : {}),
      };
    }

    return prisma.agentShift.count({ where });
  },

  findById: (id: string) =>
    prisma.agentShift.findUnique({
      where: { id },
      include: { agent: true, booking: true },
    }),

  update: (
    id: string,
    data: {
      agentId?: string;
      bookingId?: string | null;
      startAt?: Date;
      endAt?: Date;
      status?: ShiftStatus;
      notes?: string | null;
    }
  ) =>
    prisma.agentShift.update({
      where: { id },
      data: {
        ...data,
        bookingId: data.bookingId === null ? null : data.bookingId,
        notes: data.notes === null ? null : data.notes,
      },
      include: { agent: true, booking: true },
    }),

  remove: (id: string) => prisma.agentShift.delete({ where: { id } }),
};
