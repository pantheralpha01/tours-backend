import { contractRepository } from "./contract.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";

export const contractService = {
  create: (data: {
    bookingId: string;
    partnerId?: string;
    status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
    fileUrl?: string;
    signedAt?: Date;
    metadata?: Record<string, unknown>;
  }) => contractRepository.create(data),

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    partnerId?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      contractRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        bookingId: params?.bookingId,
        partnerId: params?.partnerId,
      }),
      contractRepository.count({
        status: params?.status,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        bookingId: params?.bookingId,
        partnerId: params?.partnerId,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => contractRepository.findById(id),

  update: (
    id: string,
    data: {
      partnerId?: string;
      status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
      fileUrl?: string;
      signedAt?: Date;
      metadata?: Record<string, unknown>;
    }
  ) => contractRepository.update(id, data),

  remove: (id: string) => contractRepository.remove(id),
};
