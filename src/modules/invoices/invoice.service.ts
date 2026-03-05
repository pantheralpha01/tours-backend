/**
 * Invoice Service - REFACTORED
 * Focuses on business logic orchestration, delegates DB transformation to mapper
 * Follows the roadmap: service layer + repository pattern + DTOs
 */

import { Invoice, Transaction, InvoiceStatus } from "@prisma/client";
import { invoiceRepository, transactionRepository } from "./invoice.repository";
import { ApiError } from "../../utils/ApiError";
import { bookingRepository } from "../bookings/booking.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import {
  CreateInvoiceDTO,
  UpdateInvoiceStatusDTO,
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from "./invoice.dto";
import {
  mapCreateDTOToDb,
  mapUpdateStatusDTOToDb,
  mapCreateTransactionDTOToDb,
  mapUpdateTransactionDTOToDb,
} from "./invoice.mapper";

/**
 * Create a new invoice from a booking
 */
const create = async (input: CreateInvoiceDTO): Promise<Invoice> => {
  // Step 1: Verify booking exists
  const booking = await bookingRepository.findById(input.bookingId);
  if (!booking) {
    throw ApiError.notFound(`Booking with ID '${input.bookingId}' not found`);
  }

  // Step 2: Use booking reference for tracking
  const bookingRef = booking.bookingReference || `BK-${Date.now()}`;

  // Step 3: Transform DTO to Prisma model using mapper
  const dbInput = await mapCreateDTOToDb(input, bookingRef);

  // Step 4: Create invoice
  const invoice = await invoiceRepository.create(dbInput);

  return invoice;
};

/**
 * Get invoice by ID
 */
const getById = async (id: string): Promise<Invoice> => {
  if (!id) {
    throw ApiError.badRequest("Invoice ID is required");
  }

  const invoice = await invoiceRepository.findById(id);
  if (!invoice) {
    throw ApiError.notFound(`Invoice with ID '${id}' not found`);
  }

  return invoice;
};

/**
 * Get invoices by booking ID
 */
const getByBookingId = async (
  bookingId: string,
  skip = 0,
  take = 10
): Promise<{ invoices: Invoice[]; total: number }> => {
  // Verify booking exists
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound(`Booking with ID '${bookingId}' not found`);
  }

  return invoiceRepository.findByBookingId(bookingId, skip, take);
};

/**
 * List all invoices with filters and pagination
 */
const list = async (
  filters?: {
    status?: string;
    customerEmail?: string;
    bookingId?: string;
  },
  skip = 0,
  take = 10
): Promise<PaginatedResponse<Invoice>> => {
  const [invoices, total] = await Promise.all([
    invoiceRepository.findMany(filters, skip, take).then((r) => r.invoices),
    invoiceRepository.findMany(filters, 0, 9999).then((r) => r.total),
  ]);

  return {
    data: invoices,
    pagination: calculatePagination(
      Math.floor(skip / take) + 1,
      take,
      total
    ),
  };
};

/**
 * Update invoice status with transition validation
 */
const updateStatus = async (
  invoiceId: string,
  input: UpdateInvoiceStatusDTO
): Promise<Invoice> => {
  // Step 1: Verify invoice exists and get current state
  const invoice = await getById(invoiceId);

  // Step 2: Validate transition is allowed
  const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    DRAFT: ["SENT", "CANCELLED"],
    SENT: ["PARTIALLY_PAID", "PAID", "OVERDUE"],
    PARTIALLY_PAID: ["PAID", "OVERDUE"],
    PAID: [], // No transitions from PAID
    OVERDUE: ["PAID"],
  };

  const allowedTransitions = validTransitions[invoice.status as InvoiceStatus] || [];
  if (!allowedTransitions.includes(input.status as InvoiceStatus)) {
    throw ApiError.badRequest(
      `Cannot transition invoice from ${invoice.status} to ${input.status}`
    );
  }

  // Step 3: Transform DTO to update input
  const dbInput = mapUpdateStatusDTOToDb(input);

  // Step 4: Update invoice
  const updated = await invoiceRepository.update(invoiceId, dbInput);

  return updated;
};

/**
 * Send invoice (transition to SENT and record send timestamp)
 */
const send = async (
  invoiceId: string,
  paymentLink?: string
): Promise<Invoice> => {
  // Step 1: Get invoice
  const invoice = await getById(invoiceId);

  // Step 2: Validate can be sent
  if (invoice.status !== "DRAFT") {
    throw ApiError.badRequest(
      `Cannot send invoice with status: ${invoice.status}`
    );
  }

  // Step 3: Update status to SENT and record send time
  const updated = await invoiceRepository.update(invoiceId, {
    status: "SENT" as any,
    sentAt: new Date(),
    paymentLink,
  });

  return updated;
};

/**
 * Delete invoice
 */
const remove = async (invoiceId: string): Promise<void> => {
  // Verify exists
  await getById(invoiceId);

  // Delete
  await invoiceRepository.delete(invoiceId);
};

/**
 * Create transaction for invoice (payment or deposit)
 */
const createTransaction = async (
  input: CreateTransactionDTO
): Promise<Transaction> => {
  // Step 1: Verify invoice exists
  const invoice = await getById(input.invoiceId);

  // Step 2: Validate amount
  if (input.amount <= 0) {
    throw ApiError.badRequest("Transaction amount must be greater than 0");
  }

  // Step 3: Validate amount doesn't exceed remaining balance
  const paidAmount = invoice.paidAmount.toNumber();
  const totalAmount = invoice.totalAmount.toNumber();
  const remainingBalance = totalAmount - paidAmount;

  if (input.amount > remainingBalance) {
    throw ApiError.badRequest(
      `Transaction amount exceeds remaining balance (${remainingBalance})`
    );
  }

  // Step 4: Transform DTO to Prisma model using mapper
  const dbInput = mapCreateTransactionDTOToDb(input);

  // Step 5: Create transaction
  const transaction = await transactionRepository.create(dbInput);

  return transaction;
};

/**
 * Get transaction by ID
 */
const getTransactionById = async (id: string): Promise<Transaction> => {
  if (!id) {
    throw ApiError.badRequest("Transaction ID is required");
  }

  const transaction = await transactionRepository.findById(id);
  if (!transaction) {
    throw ApiError.notFound(`Transaction with ID '${id}' not found`);
  }

  return transaction;
};

/**
 * List transactions for an invoice
 */
const listTransactions = async (
  invoiceId: string,
  skip = 0,
  take = 10
): Promise<PaginatedResponse<Transaction>> => {
  // Verify invoice exists
  await getById(invoiceId);

  const [transactions, total] = await Promise.all([
    transactionRepository.findByInvoiceId(invoiceId, skip, take),
    transactionRepository.countByInvoiceId(invoiceId),
  ]);

  return {
    data: transactions,
    pagination: calculatePagination(
      Math.floor(skip / take) + 1,
      take,
      total
    ),
  };
};

/**
 * Update transaction status
 */
const updateTransaction = async (
  transactionId: string,
  input: UpdateTransactionDTO
): Promise<Transaction> => {
  // Step 1: Verify transaction exists
  const transaction = await getTransactionById(transactionId);

  // Step 2: Validate status transition if provided
  if (input.status) {
    const validTransitions: Record<string, string[]> = {
      INITIATED: ["PENDING", "CANCELLED"],
      PENDING: ["COMPLETED", "FAILED", "CANCELLED"],
      COMPLETED: [], // No transitions from COMPLETED
      FAILED: ["PENDING"], // Can retry failed transactions
      CANCELLED: [],
    };

    const allowedTransitions = validTransitions[transaction.status] || [];
    if (!allowedTransitions.includes(input.status)) {
      throw ApiError.badRequest(
        `Cannot transition transaction from ${transaction.status} to ${input.status}`
      );
    }
  }

  // Step 3: Transform DTO to update input
  const dbInput = mapUpdateTransactionDTOToDb(input);

  if (Object.keys(dbInput).length === 0) {
    return transaction; // Nothing to update
  }

  // Step 4: Update transaction
  const updated = await transactionRepository.update(transactionId, dbInput);

  return updated;
};

export const invoiceService = {
  create,
  getById,
  getByBookingId,
  list,
  updateStatus,
  send,
  remove,
  createTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
};
