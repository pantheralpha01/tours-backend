import { refundRepository } from "./refund.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { assertTransition } from "../../utils/stateMachine";
import { refundTransitions } from "./refund.transitions";
import { bookingEventRepository } from "../bookings/booking-event.repository";

export const refundService = {
  create: (data: {
    bookingId: string;
    paymentId: string;
    amount: number;
    currency?: "USD" | "KES";
    reason: string;
    reference?: string;
  }) =>
    refundRepository.create({
      ...data,
      currency: data.currency ?? "USD",
    }),

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    paymentId?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      refundRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        bookingId: params?.bookingId,
        paymentId: params?.paymentId,
      }),
      refundRepository.count({
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        bookingId: params?.bookingId,
        paymentId: params?.paymentId,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => refundRepository.findById(id),

  update: async (
    id: string,
    data: {
      status?: "REQUESTED" | "APPROVED" | "DECLINED" | "PROCESSING" | "COMPLETED" | "FAILED";
      reference?: string;
      processedAt?: Date;
      transitionReason?: string;
    }
  ) => {
    const current = await refundRepository.findById(id);
    if (!current) {
      throw new Error("Refund not found");
    }

    if (data.status) {
      assertTransition({
        entity: "refund",
        currentState: current.status,
        targetState: data.status,
        transitions: refundTransitions,
      });
    }

    // Filter out fields that don't exist in the Refund model
    const { transitionReason, ...updateData } = data;
    const updated = await refundRepository.update(id, updateData);

    if (data.status && data.status !== current.status) {
      await bookingEventRepository.create({
        bookingId: current.bookingId,
        type: "UPDATED",
        metadata: {
          entity: "REFUND",
          refundId: current.id,
          fromStatus: current.status,
          toStatus: data.status,
          reason: data.transitionReason,
        },
      });
    }

    return updated;
  },

  remove: (id: string) => refundRepository.remove(id),
};
