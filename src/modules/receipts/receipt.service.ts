import { receiptRepository } from "./receipt.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";

export const receiptService = {
  create: (data: {
    bookingId: string;
    paymentId: string;
    receiptNumber: string;
    amount: number;
    currency?: "USD" | "KES";
    status?: "ISSUED" | "VOID";
    issuedAt?: Date;
    fileUrl?: string;
  }) =>
    receiptRepository.create({
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
      receiptRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        bookingId: params?.bookingId,
        paymentId: params?.paymentId,
      }),
      receiptRepository.count({
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

  getById: (id: string) => receiptRepository.findById(id),

  update: (
    id: string,
    data: {
      status?: "ISSUED" | "VOID";
      fileUrl?: string;
    }
  ) => receiptRepository.update(id, data),

  remove: (id: string) => receiptRepository.remove(id),
};
