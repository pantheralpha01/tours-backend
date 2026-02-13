import { prisma } from "../../config/prisma";

export const dispatchRepository = {
  create: (data: {
    bookingId: string;
    assignedToId?: string;
    status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    notes?: string;
    startedAt?: Date;
    completedAt?: Date;
  }) =>
    prisma.dispatch.create({
      data: {
        bookingId: data.bookingId,
        assignedToId: data.assignedToId,
        status: data.status ?? "PENDING",
        notes: data.notes,
        startedAt: data.startedAt,
        completedAt: data.completedAt,
      },
      include: { booking: true, assignedTo: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    bookingId?: string;
    assignedToId?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId;
    }
    if (params?.agentId) {
      where.OR = [
        { assignedToId: params.agentId },
        { booking: { agentId: params.agentId } },
      ];
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

    return prisma.dispatch.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true, assignedTo: true },
    });
  },

  count: (params?: {
    status?: string;
    bookingId?: string;
    assignedToId?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.assignedToId) {
      where.assignedToId = params.assignedToId;
    }
    if (params?.agentId) {
      where.OR = [
        { assignedToId: params.agentId },
        { booking: { agentId: params.agentId } },
      ];
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }

    return prisma.dispatch.count({ where });
  },

  findById: (id: string) =>
    prisma.dispatch.findUnique({
      where: { id },
      include: { booking: true, assignedTo: true },
    }),

  update: (
    id: string,
    data: {
      assignedToId?: string;
      status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      notes?: string;
      startedAt?: Date;
      completedAt?: Date;
    }
  ) =>
    prisma.dispatch.update({
      where: { id },
      data,
      include: { booking: true, assignedTo: true },
    }),

  remove: (id: string) => prisma.dispatch.delete({ where: { id } }),
};
