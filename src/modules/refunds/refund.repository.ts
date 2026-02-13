import { prisma } from "../../config/prisma";

export const refundRepository = {
  create: (data: {
    bookingId: string;
    paymentId: string;
    amount: number;
    currency: "USD" | "KES";
    reason: string;
    reference?: string;
  }) =>
    prisma.refund.create({
      data: {
        bookingId: data.bookingId,
        paymentId: data.paymentId,
        amount: data.amount,
        currency: data.currency,
        reason: data.reason,
        reference: data.reference,
      },
      include: { booking: true, payment: true },
    }),

  findMany: (params?: {
    skip?: number;
    take?: number;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
    bookingId?: string;
    paymentId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.paymentId) {
      where.paymentId = params.paymentId;
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

    return prisma.refund.findMany({
      where,
      orderBy,
      skip: params?.skip,
      take: params?.take,
      include: { booking: true, payment: true },
    });
  },

  count: (params?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookingId?: string;
    paymentId?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.bookingId) {
      where.bookingId = params.bookingId;
    }
    if (params?.paymentId) {
      where.paymentId = params.paymentId;
    }
    if (params?.dateFrom || params?.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) where.createdAt.gte = params.dateFrom;
      if (params.dateTo) where.createdAt.lte = params.dateTo;
    }
    return prisma.refund.count({ where });
  },

  findById: (id: string) =>
    prisma.refund.findUnique({ where: { id }, include: { booking: true, payment: true } }),

  update: (
    id: string,
    data: {
      status?: "REQUESTED" | "APPROVED" | "DECLINED" | "PROCESSING" | "COMPLETED" | "FAILED";
      reference?: string;
      processedAt?: Date;
    }
  ) =>
    prisma.refund.update({
      where: { id },
      data,
      include: { booking: true, payment: true },
    }),

  remove: (id: string) => prisma.refund.delete({ where: { id } }),
};
