import { prisma } from "../../config/prisma";

export const contractRepository = {
  create: (data: {
    bookingId: string;
    partnerId?: string;
    status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
    fileUrl?: string;
    signedAt?: Date;
    metadata?: Record<string, unknown>;
  }) =>
    prisma.contract.create({
      data: {
        bookingId: data.bookingId,
        partnerId: data.partnerId,
        status: data.status ?? "DRAFT",
        fileUrl: data.fileUrl,
        signedAt: data.signedAt,
        metadata: data.metadata ? (data.metadata as any) : null,
      },
      include: { booking: true, partner: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    partnerId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.partnerId) {
      where.partnerId = params.partnerId;
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

    return prisma.contract.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true, partner: true },
    });
  },

  count: (params?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookingId?: string;
    partnerId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.partnerId) {
      where.partnerId = params.partnerId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.contract.count({ where });
  },

  findById: (id: string) =>
    prisma.contract.findUnique({ where: { id }, include: { booking: true, partner: true } }),

  update: (
    id: string,
    data: {
      partnerId?: string;
      status?: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
      fileUrl?: string;
      signedAt?: Date;
      metadata?: Record<string, unknown>;
    }
  ) => {
    const updateData: any = { ...data };
    if (data.metadata !== undefined) {
      updateData.metadata = data.metadata ? (data.metadata as any) : null;
    }
    return prisma.contract.update({
      where: { id },
      data: updateData,
      include: { booking: true, partner: true },
    });
  },

  remove: (id: string) => prisma.contract.delete({ where: { id } }),
};
