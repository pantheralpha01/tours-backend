import { quoteRepository } from "./quote.repository";
import {
  BOOKING_COMMISSION_RATE,
  calculateCommission,
  convertUsdToKes,
} from "../bookings/booking.constants";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";

export const quoteService = {
  create: (data: {
    bookingId: string;
    agentId: string;
    title: string;
    amount: number;
    currency?: "USD" | "KES";
    expiresAt?: Date;
    items?: Record<string, unknown>;
    notes?: string;
  }) => {
    const currency = data.currency ?? "USD";
    const commission = calculateCommission(data.amount);
    const commissionInKes =
      currency === "USD" ? convertUsdToKes(commission) : commission;

    return quoteRepository.create({
      ...data,
      currency,
      commissionRate: BOOKING_COMMISSION_RATE.toString(),
      commissionAmount: commissionInKes.toString(),
      commissionCurrency: "KES",
    });
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    agentId?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      quoteRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        bookingId: params?.bookingId,
        agentId: params?.agentId,
      }),
      quoteRepository.count({
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        bookingId: params?.bookingId,
        agentId: params?.agentId,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => quoteRepository.findById(id),

  update: (
    id: string,
    data: {
      title?: string;
      status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
      amount?: number;
      currency?: "USD" | "KES";
      expiresAt?: Date;
      items?: Record<string, unknown>;
      notes?: string;
    }
  ) => {
    let commissionAmount: string | undefined;
    let commissionCurrency: "USD" | "KES" | undefined;

    if (typeof data.amount === "number") {
      const commission = calculateCommission(data.amount);
      const currency = data.currency ?? "USD";
      const commissionInKes =
        currency === "USD" ? convertUsdToKes(commission) : commission;
      commissionAmount = commissionInKes.toString();
      commissionCurrency = "KES";
    }

    return quoteRepository.update(id, {
      ...data,
      commissionAmount,
      commissionCurrency,
    });
  },

  remove: (id: string) => quoteRepository.remove(id),
};
