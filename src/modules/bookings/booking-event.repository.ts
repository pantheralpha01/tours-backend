import { prisma } from "../../config/prisma";
import { BookingEventType, Prisma } from "@prisma/client";

export const bookingEventRepository = {
  create: (data: {
    bookingId: string;
    type: BookingEventType;
    actorId?: string;
    metadata?: Prisma.JsonValue;
  }) =>
    prisma.bookingEvent.create({
      data: {
        bookingId: data.bookingId,
        type: data.type,
        actorId: data.actorId,
        metadata: (data.metadata || undefined) as any,
      },
    }),

  listByBooking: (params: {
    bookingId: string;
    skip?: number;
    take?: number;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: "asc" | "desc";
  }) =>
    prisma.bookingEvent.findMany({
      where: {
        bookingId: params.bookingId,
        createdAt: params.dateFrom || params.dateTo ? {
          ...(params.dateFrom ? { gte: params.dateFrom } : {}),
          ...(params.dateTo ? { lte: params.dateTo } : {}),
        } : undefined,
      },
      orderBy: { createdAt: params.sort ?? "desc" },
      skip: params.skip,
      take: params.take,
    }),

  countByBooking: (params: { bookingId: string; dateFrom?: Date; dateTo?: Date }) =>
    prisma.bookingEvent.count({
      where: {
        bookingId: params.bookingId,
        createdAt: params.dateFrom || params.dateTo ? {
          ...(params.dateFrom ? { gte: params.dateFrom } : {}),
          ...(params.dateTo ? { lte: params.dateTo } : {}),
        } : undefined,
      },
    }),
};
