import { prisma } from "../../config/prisma";

export const paymentRepository = {
  create: (data: {
    bookingId: string;
    provider: string;
    amount: number;
    currency?: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
  }) =>
    prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        provider: data.provider,
        amount: data.amount,
        currency: (data.currency as "USD" | "KES") ?? "USD",
        reference: data.reference,
        metadata: data.metadata ? (data.metadata as any) : null,
      },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.state = params.status;
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

    return prisma.payment.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true },
    });
  },

  count: (params?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.state = params.status;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.payment.count({ where });
  },

  findById: (id: string) =>
    prisma.payment.findUnique({ where: { id }, include: { booking: true } }),

  update: (
    id: string,
    data: {
      state?: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
      reference?: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    const updateData: any = {};
    if (data.state !== undefined) updateData.state = data.state;
    if (data.reference !== undefined) updateData.reference = data.reference;
    if (data.metadata !== undefined) updateData.metadata = data.metadata ? (data.metadata as any) : null;
    return prisma.payment.update({
      where: { id },
      data: updateData,
      include: { booking: true },
    });
  },

  remove: (id: string) => prisma.payment.delete({ where: { id } }),
};
