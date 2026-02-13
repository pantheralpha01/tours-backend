import { prisma } from "../../config/prisma";

export const disputeRepository = {
  create: (data: {
    bookingId: string;
    reason: string;
    description?: string;
    openedById: string;
    assignedToId?: string;
  }) =>
    prisma.dispute.create({
      data: {
        bookingId: data.bookingId,
        reason: data.reason,
        description: data.description,
        openedById: data.openedById,
        assignedToId: data.assignedToId,
      },
      include: { booking: true, openedBy: true, assignedTo: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    openedById?: string;
    assignedToId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.openedById) {
      where.openedById = params.openedById;
    }
    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId;
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

    return prisma.dispute.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true, openedBy: true, assignedTo: true },
    });
  },

  count: (params?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookingId?: string;
    openedById?: string;
    assignedToId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.openedById) {
      where.openedById = params.openedById;
    }
    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.dispute.count({ where });
  },

  findById: (id: string) =>
    prisma.dispute.findUnique({
      where: { id },
      include: { booking: true, openedBy: true, assignedTo: true },
    }),

  update: (
    id: string,
    data: {
      status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
      reason?: string;
      description?: string;
      assignedToId?: string;
      resolvedAt?: Date;
    }
  ) =>
    prisma.dispute.update({
      where: { id },
      data,
      include: { booking: true, openedBy: true, assignedTo: true },
    }),

  remove: (id: string) => prisma.dispute.delete({ where: { id } }),
};
