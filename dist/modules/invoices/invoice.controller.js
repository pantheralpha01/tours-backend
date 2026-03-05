"use strict";
/**
 * Invoice Controller - REFACTORED
 * Clean layer that validates API input and delegates all business logic to service
 * Follows: validation -> service -> response
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceController = void 0;
const invoice_service_1 = require("./invoice.service");
const invoice_validation_1 = require("./invoice.validation");
const pagination_1 = require("../../utils/pagination");
/**
 * Create a new invoice
 * POST /api/invoices
 */
const create = async (req, res, next) => {
    try {
        // Validate API input
        const payload = invoice_validation_1.createInvoiceSchema.parse(req.body);
        // Call service
        const invoice = await invoice_service_1.invoiceService.create(payload);
        return res.status(201).json(invoice);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Get invoice by ID
 * GET /api/invoices/:id
 */
const getById = async (req, res, next) => {
    try {
        const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
        const invoice = await invoice_service_1.invoiceService.getById(id);
        return res.status(200).json(invoice);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Get invoices for a booking
 * GET /api/invoices/booking/:bookingId
 */
const getByBookingId = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const params = pagination_1.paginationSchema.parse(req.query);
        const skip = ((params.page || 1) - 1) * (params.limit || 10);
        const take = params.limit || 10;
        const result = await invoice_service_1.invoiceService.getByBookingId(bookingId, skip, take);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * List all invoices with filters
 * GET /api/invoices
 */
const list = async (req, res, next) => {
    try {
        const params = invoice_validation_1.listInvoicesSchema.parse(req.query);
        const skip = ((params.page || 1) - 1) * (params.limit || 10);
        const take = params.limit || 10;
        const result = await invoice_service_1.invoiceService.list({
            status: params.status,
            customerEmail: params.customerEmail,
            bookingId: params.bookingId,
        }, skip, take);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Update invoice status (transition)
 * PATCH /api/invoices/:id/status
 */
const updateStatus = async (req, res, next) => {
    try {
        const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
        const payload = invoice_validation_1.updateInvoiceStatusSchema.parse(req.body);
        const invoice = await invoice_service_1.invoiceService.updateStatus(id, payload);
        return res.status(200).json(invoice);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Send invoice to customer
 * POST /api/invoices/:id/send
 */
const send = async (req, res, next) => {
    try {
        const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
        const { paymentLink, customMessage } = invoice_validation_1.sendInvoiceSchema.parse(req.body);
        const invoice = await invoice_service_1.invoiceService.send(id, paymentLink);
        return res.status(200).json(invoice);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
const remove = async (req, res, next) => {
    try {
        const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
        await invoice_service_1.invoiceService.remove(id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Record payment/transaction for invoice
 * POST /api/invoices/:id/payments
 */
const recordPayment = async (req, res, next) => {
    try {
        const { invoiceId, transactionId, type, amount, currency, status, paymentMethod, reference, metadata } = invoice_validation_1.createTransactionSchema.parse(req.body);
        const transaction = await invoice_service_1.invoiceService.createTransaction({
            invoiceId,
            transactionId,
            type,
            amount,
            currency,
            status,
            paymentMethod,
            reference,
            metadata,
        });
        return res.status(201).json(transaction);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Get transactions for an invoice
 * GET /api/invoices/:id/transactions
 */
const getTransactions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const params = pagination_1.paginationSchema.parse(req.query);
        const skip = ((params.page || 1) - 1) * (params.limit || 10);
        const take = params.limit || 10;
        const result = await invoice_service_1.invoiceService.listTransactions(id, skip, take);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
const deleteInvoice = async (req, res, next) => {
    try {
        const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
        await invoice_service_1.invoiceService.remove(id);
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
};
exports.invoiceController = {
    create,
    getById,
    getByBookingId,
    list,
    updateStatus,
    send,
    recordPayment,
    getTransactions,
    delete: deleteInvoice,
};
//# sourceMappingURL=invoice.controller.js.map