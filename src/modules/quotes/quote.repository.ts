import { prisma } from "../../config/prisma";

export const quoteRepository = {
  create: (data: {
    bookingId: string;
    agentId: string;
    title: string;
    amount: number;
    currency: "USD" | "KES";
    commissionRate: string;
    commissionAmount: string;
    commissionCurrency: "USD" | "KES";
    expiresAt?: Date;
    items?: Record<string, unknown>;
    notes?: string;
  }) =>
    prisma.quote.create({
      data: {
        bookingId: data.bookingId,
        agentId: data.agentId,
        title: data.title,
        amount: data.amount,
        currency: data.currency,
        commissionRate: data.commissionRate,
        commissionAmount: data.commissionAmount,
        commissionCurrency: data.commissionCurrency,
        expiresAt: data.expiresAt,
        items: data.items ? (data.items as any) : null,
        notes: data.notes,
      },
      include: { booking: true, agent: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    agentId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
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

    return prisma.quote.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true, agent: true },
    });
  },

  count: (params?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookingId?: string;
    agentId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.quote.count({ where });
  },

  findById: (id: string) =>
    prisma.quote.findUnique({ where: { id }, include: { booking: true, agent: true } }),

  update: (
    id: string,
    data: {
      title?: string;
      status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
      amount?: number;
      currency?: "USD" | "KES";
      commissionRate?: string;
      commissionAmount?: string;
      commissionCurrency?: "USD" | "KES";
      expiresAt?: Date;
      items?: Record<string, unknown>;
      notes?: string;
    }
  ) => {
    const updateData: any = { ...data };
    if (data.items !== undefined) {
      updateData.items = data.items ? (data.items as any) : null;
    }
    return prisma.quote.update({
      where: { id },
      data: updateData,
      include: { booking: true, agent: true },
    });
  },

  remove: (id: string) => prisma.quote.delete({ where: { id } }),
};
