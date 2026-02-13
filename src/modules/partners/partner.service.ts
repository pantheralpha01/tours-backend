import { partnerRepository } from "./partner.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { partnerEventRepository } from "./partner-event.repository";

export const partnerService = {
  create: (data: {
    name: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    createdById?: string;
  }) => partnerRepository.create(data),

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    approvalStatus?: string;
    createdById?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      partnerRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        approvalStatus: params?.approvalStatus,
        createdById: params?.createdById,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
      }),
      partnerRepository.count({
        status: params?.status,
        approvalStatus: params?.approvalStatus,
        createdById: params?.createdById,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => partnerRepository.findById(id),

  update: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      isActive?: boolean;
      approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
      approvedById?: string | null;
      approvedAt?: Date | null;
      rejectedReason?: string | null;
    }
  ) => partnerRepository.update(id, data),

  approve: async (id: string, approvedById: string) => {
    const partner = await partnerRepository.update(id, {
      approvalStatus: "APPROVED",
      approvedById,
      approvedAt: new Date(),
      rejectedReason: null,
    });

    await partnerEventRepository.create({
      partnerId: id,
      type: "APPROVED",
      actorId: approvedById,
    });

    return partner;
  },

  reject: async (id: string, approvedById: string, reason?: string) => {
    const partner = await partnerRepository.update(id, {
      approvalStatus: "REJECTED",
      approvedById,
      approvedAt: new Date(),
      rejectedReason: reason ?? null,
    });

    await partnerEventRepository.create({
      partnerId: id,
      type: "REJECTED",
      actorId: approvedById,
      metadata: reason ? { reason } : undefined,
    });

    return partner;
  },

  remove: (id: string) => partnerRepository.remove(id),
};
