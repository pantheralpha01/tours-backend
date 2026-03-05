import { prisma } from "../../config/prisma";
import { Invoice, Transaction, InvoiceStatus, PaymentState, TransactionType, Currency } from "@prisma/client";

export const invoiceRepository = {
  create: async (data: {
    bookingId: string;
    invoiceNumber: string;
    bookingRef: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    dueDate: Date;
    notes?: string;
  }): Promise<Invoice> => {
    return prisma.invoice.create({
      data: {
        ...data,
        status: "DRAFT",
        paidAmount: 0,
      },
    });
  },

  findById: async (id: string): Promise<Invoice | null> => {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: true,
        transactions: true,
      },
    });
  },

  findByInvoiceNumber: async (invoiceNumber: string): Promise<Invoice | null> => {
    return prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        booking: true,
        transactions: true,
      },
    });
  },

  findByBookingId: async (
    bookingId: string,
    skip = 0,
    take = 10
  ): Promise<{ invoices: Invoice[]; total: number }> => {
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: { bookingId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          transactions: true,
        },
      }),
      prisma.invoice.count({
        where: { bookingId },
      }),
    ]);
    return { invoices, total };
  },

  findMany: async (
    filters?: {
      status?: string;
      customerEmail?: string;
      bookingId?: string;
    },
    skip = 0,
    take = 10
  ): Promise<{ invoices: Invoice[]; total: number }> => {
    const where: Record<string, any> = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.customerEmail) {
      where.customerEmail = filters.customerEmail;
    }
    if (filters?.bookingId) {
      where.bookingId = filters.bookingId;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          transactions: true,
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total };
  },

  updateStatus: async (
    id: string,
    status: InvoiceStatus
  ): Promise<Invoice> => {
    return prisma.invoice.update({
      where: { id },
      data: { status },
      include: {
        transactions: true,
      },
    });
  },

  updatePaymentInfo: async (
    id: string,
    data: {
      paidAmount?: number;
      status?: InvoiceStatus;
      sentAt?: Date | null;
      paidAt?: Date | null;
      paymentLink?: string;
    }
  ): Promise<Invoice> => {
    return prisma.invoice.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        transactions: true,
      },
    });
  },

  delete: async (id: string): Promise<Invoice> => {
    return prisma.invoice.delete({
      where: { id },
    });
  },
};

export const transactionRepository = {
  create: async (data: {
    invoiceId: string;
    transactionId: string;
    bookingRef: string;
    type: TransactionType;
    amount: number;
    currency: Currency;
    status: PaymentState;
    paymentMethod?: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> => {
    return prisma.transaction.create({
      data,
    });
  },

  findById: async (id: string): Promise<Transaction | null> => {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });
  },

  findByTransactionId: async (transactionId: string): Promise<Transaction | null> => {
    return prisma.transaction.findFirst({
      where: { transactionId },
      include: {
        invoice: true,
      },
    });
  },

  findByInvoiceId: async (invoiceId: string): Promise<Transaction[]> => {
    return prisma.transaction.findMany({
      where: { invoiceId },
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus: async (
    id: string,
    status: PaymentState,
    metadata?: Record<string, any>
  ): Promise<Transaction> => {
    return prisma.transaction.update({
      where: { id },
      data: {
        status,
        metadata: metadata ? { ...metadata } : undefined,
      },
      include: {
        invoice: true,
      },
    });
  },

  delete: async (id: string): Promise<Transaction> => {
    return prisma.transaction.delete({
      where: { id },
    });
  },
};
