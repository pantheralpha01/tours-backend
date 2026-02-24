import { BookingStatus, ShiftStatus } from "@prisma/client";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { shiftRepository } from "./shift.repository";
import { bookingEventRepository } from "../bookings/booking-event.repository";

const AUTO_SHIFT_NOTE = "Auto-managed from booking";

const logShiftEvent = async (
  bookingId: string,
  actorId: string | undefined,
  metadata: Record<string, unknown>
) =>
  bookingEventRepository.create({
    bookingId,
    actorId,
    type: "UPDATED",
    metadata: {
      entity: "SHIFT",
      ...metadata,
    },
  });

export const shiftService = {
  create: (data: {
    agentId: string;
    bookingId?: string | null;
    startAt: Date;
    endAt: Date;
    status?: ShiftStatus;
    notes?: string | null;
  }) => shiftRepository.create(data),

  list: async (params?: {
    page?: number;
    limit?: number;
    agentId?: string;
    bookingId?: string;
    startFrom?: Date;
    startTo?: Date;
    status?: ShiftStatus;
    sort?: "asc" | "desc";
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      shiftRepository.findMany({
        skip,
        take: limit,
        agentId: params?.agentId,
        bookingId: params?.bookingId,
        startFrom: params?.startFrom,
        startTo: params?.startTo,
        status: params?.status,
        sort: params?.sort,
      }),
      shiftRepository.count({
        agentId: params?.agentId,
        bookingId: params?.bookingId,
        startFrom: params?.startFrom,
        startTo: params?.startTo,
        status: params?.status,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => shiftRepository.findById(id),

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
  ) => shiftRepository.update(id, data),

  remove: (id: string) => shiftRepository.remove(id),

  syncWithBooking: async (input: {
    bookingId: string;
    agentId: string;
    status: BookingStatus;
    startAt?: Date | null;
    endAt?: Date | null;
    actorId?: string;
    source?: string;
  }) => {
    const existing = await shiftRepository.findByBooking(input.bookingId);

    if (input.status === "CANCELLED") {
      if (existing && existing.status !== "CANCELLED") {
        const shift = await shiftRepository.update(existing.id, {
          status: "CANCELLED",
          notes: existing.notes ?? AUTO_SHIFT_NOTE,
        });

        await logShiftEvent(input.bookingId, input.actorId, {
          action: "SHIFT_AUTO_CANCELLED",
          shiftId: shift.id,
          status: shift.status,
          source: input.source,
        });
        return { action: "CANCELLED", shift };
      }
      return { action: "SKIPPED" as const };
    }

    if (input.status !== "CONFIRMED" || !input.startAt || !input.endAt) {
      return { action: "SKIPPED" as const };
    }

    if (!existing) {
      const shift = await shiftRepository.create({
        agentId: input.agentId,
        bookingId: input.bookingId,
        startAt: input.startAt,
        endAt: input.endAt,
        status: "SCHEDULED",
        notes: AUTO_SHIFT_NOTE,
      });

      await logShiftEvent(input.bookingId, input.actorId, {
        action: "SHIFT_AUTO_CREATED",
        shiftId: shift.id,
        startAt: shift.startAt,
        endAt: shift.endAt,
        status: shift.status,
        source: input.source,
      });
      return { action: "CREATED", shift };
    }

    const needsUpdate =
      existing.agentId !== input.agentId ||
      existing.startAt.getTime() !== input.startAt.getTime() ||
      existing.endAt.getTime() !== input.endAt.getTime() ||
      existing.status === "CANCELLED";

    if (!needsUpdate) {
      return { action: "UNCHANGED", shift: existing };
    }

    const shift = await shiftRepository.update(existing.id, {
      agentId: input.agentId,
      startAt: input.startAt,
      endAt: input.endAt,
      status: existing.status === "CANCELLED" ? "SCHEDULED" : existing.status,
      notes: existing.notes ?? AUTO_SHIFT_NOTE,
    });

    await logShiftEvent(input.bookingId, input.actorId, {
      action: "SHIFT_AUTO_UPDATED",
      shiftId: shift.id,
      startAt: shift.startAt,
      endAt: shift.endAt,
      status: shift.status,
      source: input.source,
    });

    return { action: "UPDATED", shift };
  },
};
