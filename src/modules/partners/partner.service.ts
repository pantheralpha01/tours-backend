import { prisma } from "../../config/prisma";
import { partnerRepository } from "./partner.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { partnerEventRepository } from "./partner-event.repository";
import { hashPassword } from "../../utils/password";
import type { PartnerSignup } from "./partner.validation";

export const partnerService = {
  create: (data: {
    userId: string;
    businessName?: string;
    website?: string | null;
    description?: string;
    isActive?: boolean;
  }) => partnerRepository.create(data),

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    approvalStatus?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    search?: string;
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
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        sort: params?.sort,
        search: params?.search,
      }),
      partnerRepository.count({
        status: params?.status,
        approvalStatus: params?.approvalStatus,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
        search: params?.search,
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
      businessName?: string;
      website?: string;
      description?: string;
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

  /**
   * Partner self-signup (new registration)
   */
  signup: async (data: PartnerSignup) => {
    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create User first with PARTNER role
    const user = await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: "PARTNER",
        isActive: true,
        emailVerified: false,
      },
    });

    // Create Partner linked to User with PENDING approval status
    const partner = await partnerRepository.create({
      userId: user.id,
      businessName: data.businessName,
      website: data.website || null,
      description: data.description,
      isActive: true,
      approvalStatus: "PENDING",
      
      // Store service selections as JSON arrays
      serviceCategories: data.serviceCategories,
      getAroundServices: data.getAroundServices || [],
      verifiedStaysServices: data.verifiedStaysServices || [],
      liveLikeLocalServices: data.liveLikeLocalServices || [],
      expertAccessServices: data.expertAccessServices || [],
      gearUpServices: data.gearUpServices || [],
      getEntertainedServices: data.getEntertainedServices || [],
    });

    // Create signup event
    await partnerEventRepository.create({
      partnerId: partner.id,
      type: "APPROVED",
      metadata: {
        source: "SELF_SIGNUP",
        categories: data.serviceCategories,
      },
    });

    // Return partner with user details
    return {
      ...partner,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  },
};
