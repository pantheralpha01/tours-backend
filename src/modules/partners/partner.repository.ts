import { prisma } from "../../config/prisma";

export const partnerRepository = {
  create: (data: {
    userId: string;
    businessName?: string;
    website?: string | null;
    description?: string;
    isActive?: boolean;
    approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
    serviceCategories?: string[];
    getAroundServices?: string[];
    verifiedStaysServices?: string[];
    liveLikeLocalServices?: string[];
    expertAccessServices?: string[];
    gearUpServices?: string[];
    getEntertainedServices?: string[];
  }) =>
    prisma.partner.create({
      data: {
        userId: data.userId,
        businessName: data.businessName,
        website: data.website,
        description: data.description,
        isActive: data.isActive ?? true,
        approvalStatus: data.approvalStatus ?? "PENDING",
        serviceCategories: data.serviceCategories || [],
        getAroundServices: data.getAroundServices || [],
        verifiedStaysServices: data.verifiedStaysServices || [],
        liveLikeLocalServices: data.liveLikeLocalServices || [],
        expertAccessServices: data.expertAccessServices || [],
        gearUpServices: data.gearUpServices || [],
        getEntertainedServices: data.getEntertainedServices || [],
      },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    approvalStatus?: string;
    createdById?: string; // Deprecated - kept for backward compatibility
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    search?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.isActive = params.status === "active";
    }
    if (params?.approvalStatus) {
      where.approvalStatus = params.approvalStatus;
    }
    if (params?.search) {
      const searchTerm = params.search;
      where.OR = [
        { businessName: { contains: searchTerm, mode: "insensitive" } },
        { user: { name: { contains: searchTerm, mode: "insensitive" } } },
        { user: { email: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    const orderBy: any = {};
    if (params?.sort) {
      let sortField = params.sort;
      let sortOrder: "asc" | "desc" = "asc";
      
      // Handle format: "field:asc" or "-field" or "field"
      if (sortField.startsWith("-")) {
        sortField = sortField.substring(1);
        sortOrder = "desc";
      } else if (sortField.includes(":")) {
        const [field, order] = sortField.split(":");
        sortField = field;
        sortOrder = order === "asc" ? "asc" : "desc";
      }
      
      orderBy[sortField] = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    return prisma.partner.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { user: true, approvedBy: true },
    });
  },

  count: (params?: {
    status?: string;
    approvalStatus?: string;
    createdById?: string; // Deprecated
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.isActive = params.status === "active";
    }
    if (params?.approvalStatus) {
      where.approvalStatus = params.approvalStatus;
    }
    if (params?.search) {
      const searchTerm = params.search;
      where.OR = [
        { businessName: { contains: searchTerm, mode: "insensitive" } },
        { user: { name: { contains: searchTerm, mode: "insensitive" } } },
        { user: { email: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.partner.count({ where });
  },

  findById: (id: string) =>
    prisma.partner.findUnique({
      where: { id },
      include: { user: true, approvedBy: true },
    }),

  findByEmail: () =>
    prisma.partner.findUnique({
      where: { id: "" }, // This method is no longer used since partners are now users
      include: { user: true, approvedBy: true },
    }),

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
      serviceCategories?: string[];
      getAroundServices?: string[];
      verifiedStaysServices?: string[];
      liveLikeLocalServices?: string[];
      expertAccessServices?: string[];
      gearUpServices?: string[];
      getEntertainedServices?: string[];
    }
  ) =>
    prisma.partner.update({
      where: { id },
      data,
      include: { user: true, approvedBy: true },
    }),

  remove: (id: string) => prisma.partner.delete({ where: { id }, include: { user: true } }),
};
