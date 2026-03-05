"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = exports.invoiceService = void 0;
const prisma_1 = require("../../config/prisma");
const invoice_repository_1 = require("./invoice.repository");
const ApiError_1 = require("../../utils/ApiError");
const booking_repository_1 = require("../bookings/booking.repository");
// Helper to generate invoice number in format INV-2026-00001
const generateInvoiceNumber = async () => {
    const count = await prisma_1.prisma.invoice.count();
    const year = new Date().getFullYear();
    const number = String(count + 1).padStart(5, "0");
    return `INV-${year}-${number}`;
};
exports.invoiceService = {
    /**
     * Create a new invoice from a booking
     */
    create: async (data) => {
        // Verify booking exists
        const booking = await booking_repository_1.bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw ApiError_1.ApiError.notFound("Booking not found");
        }
        // Generate unique invoice number
        const invoiceNumber = await generateInvoiceNumber();
        // Use booking reference if available
        const bookingRef = booking.bookingReference || `BK-${Date.now()}`;
        return invoice_repository_1.invoiceRepository.create({
            ...data,
            invoiceNumber,
            bookingRef,
        });
    },
    /**
     * Get invoice by ID
     */
    getById: async (id) => {
        const invoice = await invoice_repository_1.invoiceRepository.findById(id);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        return invoice;
    },
    /**
     * Get invoices by booking ID
     */
    getByBookingId: async (bookingId, skip = 0, take = 10) => {
        return invoice_repository_1.invoiceRepository.findByBookingId(bookingId, skip, take);
    },
    /**
     * List all invoices with filters
     */
    list: async (filters, skip = 0, take = 10) => {
        return invoice_repository_1.invoiceRepository.findMany(filters, skip, take);
    },
    /**
     * Send invoice (update status and set sentAt)
     */
    send: async (invoiceId, paymentLink) => {
        const invoice = await invoice_repository_1.invoiceRepository.findById(invoiceId);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        if (invoice.status !== "DRAFT") {
            throw ApiError_1.ApiError.badRequest(`Cannot send invoice with status: ${invoice.status}`);
        }
        return invoice_repository_1.invoiceRepository.updatePaymentInfo(invoiceId, {
            status: "SENT",
            sentAt: new Date(),
            paymentLink: paymentLink || undefined,
        });
    },
    /**
     * Update invoice status
     */
    updateStatus: async (invoiceId, status) => {
        const invoice = await invoice_repository_1.invoiceRepository.findById(invoiceId);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        // Validate status transitions
        const validTransitions = {
            DRAFT: ["SENT"],
            SENT: ["PARTIALLY_PAID", "PAID", "OVERDUE"],
            PARTIALLY_PAID: ["PAID", "OVERDUE"],
            PAID: [],
            OVERDUE: ["PAID"],
        };
        if (!validTransitions[invoice.status] ||
            !validTransitions[invoice.status].includes(status)) {
            throw ApiError_1.ApiError.badRequest(`Cannot transition from ${invoice.status} to ${status}`);
        }
        return invoice_repository_1.invoiceRepository.updateStatus(invoiceId, status);
    },
    /**
     * Handle payment for invoice (create transaction and update invoice)
     */
    recordPayment: async (data) => {
        const invoice = await invoice_repository_1.invoiceRepository.findById(data.invoiceId);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        // Validate amount - convert Decimals to numbers for comparison
        const totalAmount = Number(invoice.totalAmount);
        const paidAmount = Number(invoice.paidAmount);
        const remainingBalance = totalAmount - paidAmount;
        if (data.amount > remainingBalance) {
            throw ApiError_1.ApiError.badRequest(`Payment amount (${data.amount}) exceeds remaining balance (${remainingBalance})`);
        }
        // Create transaction
        const transaction = await invoice_repository_1.transactionRepository.create({
            invoiceId: data.invoiceId,
            transactionId: data.transactionId,
            bookingRef: invoice.bookingRef,
            type: data.type,
            amount: data.amount,
            currency: data.currency || "KES",
            status: "COMPLETED",
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
        }
        else if (newPaidAmount >= depositAmount) {
            newStatus = "PARTIALLY_PAID";
        }
        const updatedInvoice = await invoice_repository_1.invoiceRepository.updatePaymentInfo(data.invoiceId, {
            paidAmount: newPaidAmount,
            status: newStatus,
            paidAt: newPaidAmount >= totalAmount ? new Date() : null,
        });
        return { transaction, invoice: updatedInvoice };
    },
    /**
     * Get invoice transactions
     */
    getTransactions: async (invoiceId) => {
        return invoice_repository_1.transactionRepository.findByInvoiceId(invoiceId);
    },
    /**
     * Delete invoice (only if in DRAFT status)
     */
    delete: async (invoiceId) => {
        const invoice = await invoice_repository_1.invoiceRepository.findById(invoiceId);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        if (invoice.status !== "DRAFT") {
            throw ApiError_1.ApiError.badRequest(`Cannot delete invoice with status: ${invoice.status}`);
        }
        await invoice_repository_1.invoiceRepository.delete(invoiceId);
    },
};
exports.transactionService = {
    /**
     * Create transaction from webhook
     */
    create: async (data) => {
        // Verify invoice exists
        const invoice = await invoice_repository_1.invoiceRepository.findById(data.invoiceId);
        if (!invoice) {
            throw ApiError_1.ApiError.notFound("Invoice not found");
        }
        // Check for duplicate transaction
        const existingTransaction = await invoice_repository_1.transactionRepository.findByTransactionId(data.transactionId);
        if (existingTransaction) {
            throw ApiError_1.ApiError.conflict("Transaction already exists");
        }
        return invoice_repository_1.transactionRepository.create({
            invoiceId: data.invoiceId,
            transactionId: data.transactionId,
            bookingRef: data.bookingRef,
            type: data.type,
            amount: data.amount,
            currency: data.currency || "KES",
            status: data.status,
            paymentMethod: data.paymentMethod,
            reference: data.reference,
            metadata: data.metadata,
        });
    },
    /**
     * Get transaction by ID
     */
    getById: async (id) => {
        const transaction = await invoice_repository_1.transactionRepository.findById(id);
        if (!transaction) {
            throw ApiError_1.ApiError.notFound("Transaction not found");
        }
        return transaction;
    },
    /**
     * Get transaction by external ID
     */
    getByTransactionId: async (transactionId) => {
        const transaction = await invoice_repository_1.transactionRepository.findByTransactionId(transactionId);
        if (!transaction) {
            throw ApiError_1.ApiError.notFound("Transaction not found");
        }
        return transaction;
    },
    /**
     * Update transaction status from webhook
     */
    updateStatus: async (transactionId, status, metadata) => {
        const transaction = await invoice_repository_1.transactionRepository.findByTransactionId(transactionId);
        if (!transaction) {
            throw ApiError_1.ApiError.notFound("Transaction not found");
        }
        const updated = await invoice_repository_1.transactionRepository.updateStatus(transaction.id, status, metadata);
        // If transaction completed, update invoice
        if (status === "COMPLETED") {
            const invoice = await invoice_repository_1.invoiceRepository.findById(updated.invoiceId);
            if (invoice) {
                const totalAmount = Number(invoice.totalAmount);
                const paidAmount = Number(invoice.paidAmount);
                const depositAmount = Number(invoice.depositAmount ?? 0);
                const newPaidAmount = paidAmount + Number(updated.amount);
                let newStatus = invoice.status;
                if (newPaidAmount >= totalAmount) {
                    newStatus = "PAID";
                }
                else if (newPaidAmount >= depositAmount) {
                    newStatus = "PARTIALLY_PAID";
                }
                await invoice_repository_1.invoiceRepository.updatePaymentInfo(invoice.id, {
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
    delete: async (id) => {
        const transaction = await invoice_repository_1.transactionRepository.findById(id);
        if (!transaction) {
            throw ApiError_1.ApiError.notFound("Transaction not found");
        }
        await invoice_repository_1.transactionRepository.delete(id);
    },
};
//# sourceMappingURL=invoice.service.old.js.map