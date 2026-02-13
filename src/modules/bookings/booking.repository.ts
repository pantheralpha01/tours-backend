import { prisma } from "../../config/prisma";

export const bookingRepository = {
  create: (data: {
    customerName: string;
    serviceTitle: string;
    amount: number;
    currency?: "USD" | "KES";
    commissionRate: number | string;
    commissionAmount: number | string;
    commissionCurrency?: "USD" | "KES";
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
    paymentStatus?: "UNPAID" | "PAID";
    agentId: string;
    serviceStartAt?: Date;
    serviceEndAt?: Date;
    serviceTimezone?: string;
  }) =>
    prisma.booking.create({
      data: {
        customerName: data.customerName,
        serviceTitle: data.serviceTitle,
        amount: data.amount,
        currency: data.currency ?? "USD",
        commissionRate: data.commissionRate,
        commissionAmount: data.commissionAmount,
        commissionCurrency: data.commissionCurrency ?? "KES",
        status: data.status ?? "DRAFT",
        paymentStatus: data.paymentStatus ?? "UNPAID",
        agentId: data.agentId,
        serviceStartAt: data.serviceStartAt,
        serviceEndAt: data.serviceEndAt,
        serviceTimezone: data.serviceTimezone,
      },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    serviceStartFrom?: Date;
    serviceStartTo?: Date;
    sort?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    if (params?.serviceStartFrom || params?.serviceStartTo) {
      where.serviceStartAt = {};
      if (params.serviceStartFrom) {
        where.serviceStartAt.gte = params.serviceStartFrom;
      }
      if (params.serviceStartTo) {
        where.serviceStartAt.lte = params.serviceStartTo;
      }
    }

    const orderBy: any = {};
    if (params?.sort) {
      const [field, order] = params.sort.split(":");
      orderBy[field] = order === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    return prisma.booking.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { agent: true },
    });
  },

  count: (params?: {
    status?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    serviceStartFrom?: Date;
    serviceStartTo?: Date;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    if (params?.serviceStartFrom || params?.serviceStartTo) {
      where.serviceStartAt = {};
      if (params.serviceStartFrom) {
        where.serviceStartAt.gte = params.serviceStartFrom;
      }
      if (params.serviceStartTo) {
        where.serviceStartAt.lte = params.serviceStartTo;
      }
    }
    return prisma.booking.count({ where });
  },

  findById: (id: string) =>
    prisma.booking.findUnique({ where: { id }, include: { agent: true } }),

  update: (
    id: string,
    data: {
      customerName?: string;
      serviceTitle?: string;
      amount?: number;
      currency?: "USD" | "KES";
      commissionRate?: number | string;
      commissionAmount?: number | string;
      commissionCurrency?: "USD" | "KES";
      status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
      paymentStatus?: "UNPAID" | "PAID";
      agentId?: string;
      serviceStartAt?: Date;
      serviceEndAt?: Date;
      serviceTimezone?: string;
    }
  ) =>
    prisma.booking.update({
      where: { id },
      data,
      include: { agent: true },
    }),

  remove: (id: string) => prisma.booking.delete({ where: { id } }),
};
