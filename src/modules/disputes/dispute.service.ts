import { disputeRepository } from "./dispute.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { assertTransition } from "../../utils/stateMachine";
import { disputeTransitions } from "./dispute.transitions";
import { bookingEventRepository } from "../bookings/booking-event.repository";

export const disputeService = {
  create: (data: {
    bookingId: string;
    reason: string;
    description?: string;
    openedById: string;
    assignedToId?: string;
  }) => disputeRepository.create(data),

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    openedById?: string;
    assignedToId?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      disputeRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        bookingId: params?.bookingId,
        openedById: params?.openedById,
        assignedToId: params?.assignedToId,
      }),
      disputeRepository.count({
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        bookingId: params?.bookingId,
        openedById: params?.openedById,
        assignedToId: params?.assignedToId,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => disputeRepository.findById(id),

  update: async (
    id: string,
    data: {
      status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
      reason?: string;
      description?: string;
      assignedToId?: string;
      resolvedAt?: Date;
      transitionReason?: string;
    }
  ) => {
    const current = await disputeRepository.findById(id);
    if (!current) {
      throw new Error("Dispute not found");
    }

    if (data.status) {
      assertTransition({
        entity: "dispute",
        currentState: current.status,
        targetState: data.status,
        transitions: disputeTransitions,
      });
    }

    // Filter out fields that don't exist in the Dispute model
    const { transitionReason, ...updateData } = data;
    const updated = await disputeRepository.update(id, updateData);

    if (data.status && data.status !== current.status) {
      await bookingEventRepository.create({
        bookingId: current.bookingId,
        type: "UPDATED",
        metadata: {
          entity: "DISPUTE",
          disputeId: current.id,
          fromStatus: current.status,
          toStatus: data.status,
          reason: data.transitionReason,
        },
      });
    }

    return updated;
  },

  remove: (id: string) => disputeRepository.remove(id),
};
