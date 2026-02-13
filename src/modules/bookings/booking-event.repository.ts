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
};
