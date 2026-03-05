"use strict";
/**
 * Invoice Service - REFACTORED
 * Focuses on business logic orchestration, delegates DB transformation to mapper
 * Follows the roadmap: service layer + repository pattern + DTOs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = void 0;
const invoice_repository_1 = require("./invoice.repository");
const ApiError_1 = require("../../utils/ApiError");
const booking_repository_1 = require("../bookings/booking.repository");
const pagination_1 = require("../../utils/pagination");
const invoice_mapper_1 = require("./invoice.mapper");
/**
 * Create a new invoice from a booking
 */
const create = async (input) => {
    // Step 1: Verify booking exists
    const booking = await booking_repository_1.bookingRepository.findById(input.bookingId);
    if (!booking) {
        throw ApiError_1.ApiError.notFound(`Booking with ID '${input.bookingId}' not found`);
    }
    // Step 2: Use booking reference for tracking
    const bookingRef = booking.bookingReference || `BK-${Date.now()}`;
    // Step 3: Transform DTO to Prisma model using mapper
    const dbInput = await (0, invoice_mapper_1.mapCreateDTOToDb)(input, bookingRef);
    // Step 4: Create invoice
    const invoice = await invoice_repository_1.invoiceRepository.create(dbInput);
    return invoice;
};
/**
 * Get invoice by ID
 */
const getById = async (id) => {
    if (!id) {
        throw ApiError_1.ApiError.badRequest("Invoice ID is required");
    }
    const invoice = await invoice_repository_1.invoiceRepository.findById(id);
    if (!invoice) {
        throw ApiError_1.ApiError.notFound(`Invoice with ID '${id}' not found`);
    }
    return invoice;
};
/**
 * Get invoices by booking ID
 */
const getByBookingId = async (bookingId, skip = 0, take = 10) => {
    // Verify booking exists
    const booking = await booking_repository_1.bookingRepository.findById(bookingId);
    if (!booking) {
        throw ApiError_1.ApiError.notFound(`Booking with ID '${bookingId}' not found`);
    }
    return invoice_repository_1.invoiceRepository.findByBookingId(bookingId, skip, take);
};
/**
 * List all invoices with filters and pagination
 */
const list = async (filters, skip = 0, take = 10) => {
    const [invoices, total] = await Promise.all([
        invoice_repository_1.invoiceRepository.findMany(filters, skip, take).then((r) => r.invoices),
        invoice_repository_1.invoiceRepository.findMany(filters, 0, 9999).then((r) => r.total),
    ]);
    return {
        data: invoices,
        pagination: (0, pagination_1.calculatePagination)(Math.floor(skip / take) + 1, take, total),
    };
};
/**
 * Update invoice status with transition validation
 */
const updateStatus = async (invoiceId, input) => {
    // Step 1: Verify invoice exists and get current state
    const invoice = await getById(invoiceId);
    // Step 2: Validate transition is allowed
    const validTransitions = {
        DRAFT: ["SENT", "CANCELLED"],
        SENT: ["PARTIALLY_PAID", "PAID", "OVERDUE"],
        PARTIALLY_PAID: ["PAID", "OVERDUE"],
        PAID: [], // No transitions from PAID
        OVERDUE: ["PAID"],
    };
    const allowedTransitions = validTransitions[invoice.status] || [];
    if (!allowedTransitions.includes(input.status)) {
        throw ApiError_1.ApiError.badRequest(`Cannot transition invoice from ${invoice.status} to ${input.status}`);
    }
    // Step 3: Transform DTO to update input
    const dbInput = (0, invoice_mapper_1.mapUpdateStatusDTOToDb)(input);
    // Step 4: Update invoice
    const updated = await invoice_repository_1.invoiceRepository.update(invoiceId, dbInput);
    return updated;
};
/**
 * Send invoice (transition to SENT and record send timestamp)
 */
const send = async (invoiceId, paymentLink) => {
    // Step 1: Get invoice
    const invoice = await getById(invoiceId);
    // Step 2: Validate can be sent
    if (invoice.status !== "DRAFT") {
        throw ApiError_1.ApiError.badRequest(`Cannot send invoice with status: ${invoice.status}`);
    }
    // Step 3: Update status to SENT and record send time
    const updated = await invoice_repository_1.invoiceRepository.update(invoiceId, {
        status: "SENT",
        sentAt: new Date(),
        paymentLink,
    });
    return updated;
};
/**
 * Delete invoice
 */
const remove = async (invoiceId) => {
    // Verify exists
    await getById(invoiceId);
    // Delete
    await invoice_repository_1.invoiceRepository.delete(invoiceId);
};
/**
 * Create transaction for invoice (payment or deposit)
 */
const createTransaction = async (input) => {
    // Step 1: Verify invoice exists
    const invoice = await getById(input.invoiceId);
    // Step 2: Validate amount
    if (input.amount <= 0) {
        throw ApiError_1.ApiError.badRequest("Transaction amount must be greater than 0");
    }
    // Step 3: Validate amount doesn't exceed remaining balance
    const paidAmount = invoice.paidAmount.toNumber();
    const totalAmount = invoice.totalAmount.toNumber();
    const remainingBalance = totalAmount - paidAmount;
    if (input.amount > remainingBalance) {
        throw ApiError_1.ApiError.badRequest(`Transaction amount exceeds remaining balance (${remainingBalance})`);
    }
    // Step 4: Transform DTO to Prisma model using mapper
    const dbInput = (0, invoice_mapper_1.mapCreateTransactionDTOToDb)(input);
    // Step 5: Create transaction
    const transaction = await invoice_repository_1.transactionRepository.create(dbInput);
    return transaction;
};
/**
 * Get transaction by ID
 */
const getTransactionById = async (id) => {
    if (!id) {
        throw ApiError_1.ApiError.badRequest("Transaction ID is required");
    }
    const transaction = await invoice_repository_1.transactionRepository.findById(id);
    if (!transaction) {
        throw ApiError_1.ApiError.notFound(`Transaction with ID '${id}' not found`);
    }
    return transaction;
};
/**
 * List transactions for an invoice
 */
const listTransactions = async (invoiceId, skip = 0, take = 10) => {
    // Verify invoice exists
    await getById(invoiceId);
    const [transactions, total] = await Promise.all([
        invoice_repository_1.transactionRepository.findByInvoiceId(invoiceId, skip, take),
        invoice_repository_1.transactionRepository.countByInvoiceId(invoiceId),
    ]);
    return {
        data: transactions,
        pagination: (0, pagination_1.calculatePagination)(Math.floor(skip / take) + 1, take, total),
    };
};
/**
 * Update transaction status
 */
const updateTransaction = async (transactionId, input) => {
    // Step 1: Verify transaction exists
    const transaction = await getTransactionById(transactionId);
    // Step 2: Validate status transition if provided
    if (input.status) {
        const validTransitions = {
            INITIATED: ["PENDING", "CANCELLED"],
            PENDING: ["COMPLETED", "FAILED", "CANCELLED"],
            COMPLETED: [], // No transitions from COMPLETED
            FAILED: ["PENDING"], // Can retry failed transactions
            CANCELLED: [],
        };
        const allowedTransitions = validTransitions[transaction.status] || [];
        if (!allowedTransitions.includes(input.status)) {
            throw ApiError_1.ApiError.badRequest(`Cannot transition transaction from ${transaction.status} to ${input.status}`);
        }
    }
    // Step 3: Transform DTO to update input
    const dbInput = (0, invoice_mapper_1.mapUpdateTransactionDTOToDb)(input);
    if (Object.keys(dbInput).length === 0) {
        return transaction; // Nothing to update
    }
    // Step 4: Update transaction
    const updated = await invoice_repository_1.transactionRepository.update(transactionId, dbInput);
    return updated;
};
exports.invoiceService = {
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
//# sourceMappingURL=invoice.service.js.map