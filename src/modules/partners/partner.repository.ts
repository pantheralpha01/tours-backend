import { prisma } from "../../config/prisma";

export const partnerRepository = {
  create: (data: {
    name: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
    createdById?: string;
  }) =>
    prisma.partner.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        isActive: data.isActive ?? true,
        createdById: data.createdById,
      },
      include: { inventory: true, createdBy: true, approvedBy: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    approvalStatus?: string;
    createdById?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.isActive = params.status === "active";
    }
    if (params?.approvalStatus) {
      where.approvalStatus = params.approvalStatus;
    }
    if (params?.createdById) {
      where.createdById = params.createdById;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    const orderBy: any = {};
    if (params?.sort) {
      const [field, order] = params.sort.split(":");
      orderBy[field] = order === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    return prisma.partner.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { inventory: true, createdBy: true, approvedBy: true },
    });
  },

  count: (params?: {
    status?: string;
    approvalStatus?: string;
    createdById?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.isActive = params.status === "active";
    }
    if (params?.approvalStatus) {
      where.approvalStatus = params.approvalStatus;
    }
    if (params?.createdById) {
      where.createdById = params.createdById;
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
      include: { inventory: true, createdBy: true, approvedBy: true },
    }),

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
  ) =>
    prisma.partner.update({
      where: { id },
      data,
      include: { inventory: true, createdBy: true, approvedBy: true },
    }),

  remove: (id: string) => prisma.partner.delete({ where: { id } }),
};
