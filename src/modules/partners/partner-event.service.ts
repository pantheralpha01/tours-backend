import { partnerEventRepository } from "./partner-event.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";

export const partnerEventService = {
  list: async (params: {
    partnerId: string;
    page?: number;
    limit?: number;
    type?: "APPROVED" | "REJECTED";
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      partnerEventRepository.findMany({
        partnerId: params.partnerId,
        skip,
        take: limit,
        type: params.type,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        sort: params.sort,
      }),
      partnerEventRepository.count({
        partnerId: params.partnerId,
        type: params.type,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },
};
