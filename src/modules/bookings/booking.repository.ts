import { prisma } from "../../config/prisma";

export const bookingRepository = {
  create: (data: {
    customerName: string;
    customerPhoneNumber?: string;
    serviceTitle: string;
    amount: number;
    currency?: "USD" | "KES";
    commissionRate: number | string;
    commissionAmount: number | string;
    commissionCurrency?: "USD" | "KES";
    status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
    paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
    paymentType?: "FULL_PAYMENT" | "PARTIAL_PAYMENT";
    costAtBooking?: any;
    costPostEvent?: any;
    totalCost?: any;
    payPostEventDueDate?: Date;
    agentId: string;
    serviceStartAt?: Date;
    serviceEndAt?: Date;
    serviceTimezone?: string;
    bookingPartners?: any;
    splitPaymentEnabled?: boolean;
    depositPercentage?: number | string | null;
    depositAmount?: number | string | null;
    depositDueDate?: Date | null;
    balanceAmount?: number | string | null;
    balanceDueDate?: Date | null;
    splitPaymentNotes?: string | null;
  }) =>
    prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerPhoneNumber: data.customerPhoneNumber,
        serviceTitle: data.serviceTitle,
        amount: data.amount,
        currency: data.currency ?? "USD",
        commissionRate: data.commissionRate,
        commissionAmount: data.commissionAmount,
        commissionCurrency: data.commissionCurrency ?? "KES",
        status: data.status ?? "DRAFT",
        paymentStatus: data.paymentStatus ?? "UNPAID",
        paymentType: data.paymentType ?? "FULL_PAYMENT",
        costAtBooking: data.costAtBooking,
        costPostEvent: data.costPostEvent,
        totalCost: data.totalCost,
        payPostEventDueDate: data.payPostEventDueDate,
        splitPaymentEnabled: data.splitPaymentEnabled ?? false,
        depositPercentage: data.depositPercentage,
        depositAmount: data.depositAmount,
        depositDueDate: data.depositDueDate,
        balanceAmount: data.balanceAmount,
        balanceDueDate: data.balanceDueDate,
        splitPaymentNotes: data.splitPaymentNotes,
        agentId: data.agentId,
        serviceStartAt: data.serviceStartAt,
        serviceEndAt: data.serviceEndAt,
        serviceTimezone: data.serviceTimezone,
        ...(data.bookingPartners && { bookingPartners: data.bookingPartners }),
      },
      include: {
        agent: true,
        bookingPartners: true,
      }
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
    search?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.search) {
      where.customerName = {
        contains: params.search,
        mode: "insensitive",
      };
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
      include: {
        agent: true,
        bookingPartners: true,
      },
    });
  },

  count: (params?: {
    status?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    serviceStartFrom?: Date;
    serviceStartTo?: Date;
    search?: string;
  }) => {
    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }
    if (params?.agentId) {
      where.agentId = params.agentId;
    }
    if (params?.search) {
      where.customerName = {
        contains: params.search,
        mode: "insensitive",
      };
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
    prisma.booking.findUnique({
      where: { id },
      include: {
        agent: true,
        bookingPartners: true,
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
    }),

  update: (
    id: string,
    data: {
      customerName?: string;
      customerPhoneNumber?: string;
      serviceTitle?: string;
      amount?: number;
      currency?: "USD" | "KES";
      commissionRate?: number | string;
      commissionAmount?: number | string;
      commissionCurrency?: "USD" | "KES";
      status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
      paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
      paymentType?: "FULL_PAYMENT" | "PARTIAL_PAYMENT";
      costAtBooking?: any;
      costPostEvent?: any;
      totalCost?: any;
      payPostEventDueDate?: Date;
      agentId?: string;
      serviceStartAt?: Date;
      serviceEndAt?: Date;
      serviceTimezone?: string;
      splitPaymentEnabled?: boolean;
      depositPercentage?: number | string | null;
      depositAmount?: number | string | null;
      depositDueDate?: Date | null;
      balanceAmount?: number | string | null;
      balanceDueDate?: Date | null;
      splitPaymentNotes?: string | null;
    }
  ) =>
    prisma.booking.update({
      where: { id },
      data,
      include: {
        agent: true,
        bookingPartners: true,
      }
    }),

  remove: (id: string) => prisma.booking.delete({ where: { id } }),
};
