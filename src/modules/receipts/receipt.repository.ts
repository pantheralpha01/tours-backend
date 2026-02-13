import { prisma } from "../../config/prisma";

export const receiptRepository = {
  create: (data: {
    bookingId: string;
    paymentId: string;
    receiptNumber: string;
    amount: number;
    currency: "USD" | "KES";
    status?: "ISSUED" | "VOID";
    issuedAt?: Date;
    fileUrl?: string;
  }) =>
    prisma.receipt.create({
      data: {
        bookingId: data.bookingId,
        paymentId: data.paymentId,
        receiptNumber: data.receiptNumber,
        amount: data.amount,
        currency: data.currency,
        status: data.status ?? "ISSUED",
        issuedAt: data.issuedAt ?? new Date(),
        fileUrl: data.fileUrl,
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
      where.issuedAt = {};
      if (params.dateFrom) where.issuedAt.gte = params.dateFrom;
      if (params.dateTo) where.issuedAt.lte = params.dateTo;
    }

    const orderBy: any = {};
    if (params?.sort) {
      const [field, order] = params.sort.split(":");
      orderBy[field] = order === "asc" ? "asc" : "desc";
    } else {
      orderBy.issuedAt = "desc";
    }

    return prisma.receipt.findMany({
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
      where.issuedAt = {};
      if (params.dateFrom) where.issuedAt.gte = params.dateFrom;
      if (params.dateTo) where.issuedAt.lte = params.dateTo;
    }
    return prisma.receipt.count({ where });
  },

  findById: (id: string) =>
    prisma.receipt.findUnique({ where: { id }, include: { booking: true, payment: true } }),

  update: (
    id: string,
    data: {
      status?: "ISSUED" | "VOID";
      fileUrl?: string;
    }
  ) =>
    prisma.receipt.update({
      where: { id },
      data,
      include: { booking: true, payment: true },
    }),

  remove: (id: string) => prisma.receipt.delete({ where: { id } }),
};
