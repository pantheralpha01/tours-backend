import { Invoice, Transaction, InvoiceStatus, Currency } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { invoiceRepository, transactionRepository } from "./invoice.repository";
import { ApiError } from "../../utils/ApiError";
import { bookingRepository } from "../bookings/booking.repository";

// Helper to generate invoice number in format INV-2026-00001
const generateInvoiceNumber = async (): Promise<string> => {
  const count = await prisma.invoice.count();
  const year = new Date().getFullYear();
  const number = String(count + 1).padStart(5, "0");
  return `INV-${year}-${number}`;
};

export const invoiceService = {
  /**
   * Create a new invoice from a booking
   */
  create: async (data: {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    dueDate: Date;
    notes?: string;
  }): Promise<Invoice> => {
    // Verify booking exists
    const booking = await bookingRepository.findById(data.bookingId);
    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    // Generate unique invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Use booking reference if available
    const bookingRef = booking.bookingReference || `BK-${Date.now()}`;

    return invoiceRepository.create({
      ...data,
      invoiceNumber,
      bookingRef,
    });
  },

  /**
   * Get invoice by ID
   */
  getById: async (id: string): Promise<Invoice> => {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }
    return invoice;
  },

  /**
   * Get invoices by booking ID
   */
  getByBookingId: async (
    bookingId: string,
    skip = 0,
    take = 10
  ): Promise<{ invoices: Invoice[]; total: number }> => {
    return invoiceRepository.findByBookingId(bookingId, skip, take);
  },

  /**
   * List all invoices with filters
   */
  list: async (
    filters?: {
      status?: string;
      customerEmail?: string;
      bookingId?: string;
    },
    skip = 0,
    take = 10
  ): Promise<{ invoices: Invoice[]; total: number }> => {
    return invoiceRepository.findMany(filters, skip, take);
  },

  /**
   * Send invoice (update status and set sentAt)
   */
  send: async (
    invoiceId: string,
    paymentLink?: string
  ): Promise<Invoice> => {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }

    if (invoice.status !== "DRAFT") {
      throw ApiError.badRequest(
        `Cannot send invoice with status: ${invoice.status}`
      );
    }

    return invoiceRepository.updatePaymentInfo(invoiceId, {
      status: "SENT",
      sentAt: new Date(),
      paymentLink: paymentLink || undefined,
    });
  },

  /**
   * Update invoice status
   */
  updateStatus: async (
    invoiceId: string,
    status: InvoiceStatus
  ): Promise<Invoice> => {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }

    // Validate status transitions
    const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
      DRAFT: ["SENT"],
      SENT: ["PARTIALLY_PAID", "PAID", "OVERDUE"],
      PARTIALLY_PAID: ["PAID", "OVERDUE"],
      PAID: [],
      OVERDUE: ["PAID"],
    };

    if (
      !validTransitions[invoice.status] ||
      !validTransitions[invoice.status].includes(status)
    ) {
      throw ApiError.badRequest(
        `Cannot transition from ${invoice.status} to ${status}`
      );
    }

    return invoiceRepository.updateStatus(invoiceId, status);
  },

  /**
   * Handle payment for invoice (create transaction and update invoice)
   */
  recordPayment: async (data: {
    invoiceId: string;
    transactionId: string;
    type: "DEPOSIT" | "BALANCE";
    amount: number;
    currency?: string;
    paymentMethod?: string;
    reference?: string;
  }): Promise<{ transaction: Transaction; invoice: Invoice }> => {
    const invoice = await invoiceRepository.findById(data.invoiceId);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }

    // Validate amount - convert Decimals to numbers for comparison
    const totalAmount = Number(invoice.totalAmount);
    const paidAmount = Number(invoice.paidAmount);
    const remainingBalance = totalAmount - paidAmount;
    
    if (data.amount > remainingBalance) {
      throw ApiError.badRequest(
        `Payment amount (${data.amount}) exceeds remaining balance (${remainingBalance})`
      );
    }

    // Create transaction
    const transaction = await transactionRepository.create({
      invoiceId: data.invoiceId,
      transactionId: data.transactionId,
      bookingRef: invoice.bookingRef,
      type: data.type as any,
      amount: data.amount,
      currency: (data.currency as Currency) || "KES" as const as Currency,
      status: "COMPLETED" as any,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      metadata: {
        recordedAt: new Date().toISOString(),
      },
    });

    // Update invoice
    const newPaidAmount = paidAmount + data.amount;
    let newStatus = invoice.status;

    // Determine new status based on payment progress
    const depositAmount = Number(invoice.depositAmount ?? 0);
    if (newPaidAmount >= totalAmount) {
      newStatus = "PAID";
    } else if (newPaidAmount >= depositAmount) {
      newStatus = "PARTIALLY_PAID";
    }

    const updatedInvoice = await invoiceRepository.updatePaymentInfo(
      data.invoiceId,
      {
        paidAmount: newPaidAmount,
        status: newStatus,
        paidAt: newPaidAmount >= totalAmount ? new Date() : null,
      }
    );

    return { transaction, invoice: updatedInvoice };
  },

  /**
   * Get invoice transactions
   */
  getTransactions: async (invoiceId: string): Promise<Transaction[]> => {
    return transactionRepository.findByInvoiceId(invoiceId);
  },

  /**
   * Delete invoice (only if in DRAFT status)
   */
  delete: async (invoiceId: string): Promise<void> => {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }

    if (invoice.status !== "DRAFT") {
      throw ApiError.badRequest(
        `Cannot delete invoice with status: ${invoice.status}`
      );
    }

    await invoiceRepository.delete(invoiceId);
  },
};

export const transactionService = {
  /**
   * Create transaction from webhook
   */
  create: async (data: {
    invoiceId: string;
    transactionId: string;
    bookingRef: string;
    type: "DEPOSIT" | "BALANCE";
    amount: number;
    currency?: string;
    status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    paymentMethod?: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> => {
    // Verify invoice exists
    const invoice = await invoiceRepository.findById(data.invoiceId);
    if (!invoice) {
      throw ApiError.notFound("Invoice not found");
    }

    // Check for duplicate transaction
    const existingTransaction = await transactionRepository.findByTransactionId(
      data.transactionId
    );
    if (existingTransaction) {
      throw ApiError.conflict("Transaction already exists");
    }

    return transactionRepository.create({
      invoiceId: data.invoiceId,
      transactionId: data.transactionId,
      bookingRef: data.bookingRef,
      type: data.type as any,
      amount: data.amount,
      currency: (data.currency as Currency) || ("KES" as const as Currency),
      status: data.status as any,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      metadata: data.metadata,
    });
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw ApiError.notFound("Transaction not found");
    }
    return transaction;
  },

  /**
   * Get transaction by external ID
   */
  getByTransactionId: async (transactionId: string): Promise<Transaction> => {
    const transaction = await transactionRepository.findByTransactionId(
      transactionId
    );
    if (!transaction) {
      throw ApiError.notFound("Transaction not found");
    }
    return transaction;
  },

  /**
   * Update transaction status from webhook
   */
  updateStatus: async (
    transactionId: string,
    status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED",
    metadata?: Record<string, any>
  ): Promise<Transaction> => {
    const transaction = await transactionRepository.findByTransactionId(
      transactionId
    );
    if (!transaction) {
      throw ApiError.notFound("Transaction not found");
    }

    const updated = await transactionRepository.updateStatus(
      transaction.id,
      status as any,
      metadata
    );

    // If transaction completed, update invoice
    if (status === "COMPLETED") {
      const invoice = await invoiceRepository.findById(updated.invoiceId);
      if (invoice) {
        const totalAmount = Number(invoice.totalAmount);
        const paidAmount = Number(invoice.paidAmount);
        const depositAmount = Number(invoice.depositAmount ?? 0);
        const newPaidAmount = paidAmount + Number(updated.amount);
        let newStatus: InvoiceStatus = invoice.status;

        if (newPaidAmount >= totalAmount) {
          newStatus = "PAID";
        } else if (newPaidAmount >= depositAmount) {
          newStatus = "PARTIALLY_PAID";
        }

        await invoiceRepository.updatePaymentInfo(invoice.id, {
          paidAmount: newPaidAmount,
          status: newStatus,
          paidAt: newPaidAmount >= totalAmount ? new Date() : null,
        });
      }
    }

    return updated;
  },

  /**
   * Delete transaction
   */
  delete: async (id: string): Promise<void> => {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
        throw ApiError.notFound("Transaction not found");
    }

    await transactionRepository.delete(id);
  },
};
