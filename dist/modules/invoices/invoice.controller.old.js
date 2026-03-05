"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceController = void 0;
const invoice_service_1 = require("./invoice.service");
const invoice_validation_1 = require("./invoice.validation");
const ApiError_1 = require("../../utils/ApiError");
exports.invoiceController = {
    /**
     * POST /api/invoices
     * Create a new invoice from a booking
     */
    create: async (req, res) => {
        try {
            const parsed = invoice_validation_1.createInvoiceSchema.parse(req.body);
            const invoice = await invoice_service_1.invoiceService.create(parsed);
            res.status(201).json({
                message: "Invoice created successfully",
                data: invoice,
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * GET /api/invoices/:id
     * Get invoice by ID
     */
    getById: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            const invoice = await invoice_service_1.invoiceService.getById(id);
            res.json({
                message: "Invoice retrieved successfully",
                data: invoice,
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * GET /api/invoices
     * List invoices with filters
     */
    list: async (req, res) => {
        try {
            const { status, customerEmail, bookingId, skip = 0, take = 10 } = req.query;
            const skipNum = typeof skip === "string" ? parseInt(skip, 10) : 0;
            const takeNum = typeof take === "string" ? parseInt(take, 10) : 10;
            const { invoices, total } = await invoice_service_1.invoiceService.list({
                status: typeof status === "string" ? status : undefined,
                customerEmail: typeof customerEmail === "string" ? customerEmail : undefined,
                bookingId: typeof bookingId === "string" ? bookingId : undefined,
            }, skipNum, takeNum);
            res.json({
                message: "Invoices retrieved successfully",
                data: invoices,
                pagination: {
                    skip: skipNum,
                    take: takeNum,
                    total,
                    pages: Math.ceil(total / takeNum),
                },
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * GET /api/invoices/booking/:bookingId
     * Get invoices for a specific booking
     */
    getByBookingId: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { skip = 0, take = 10 } = req.query;
            const skipNum = typeof skip === "string" ? parseInt(skip, 10) : 0;
            const takeNum = typeof take === "string" ? parseInt(take, 10) : 10;
            const { invoices, total } = await invoice_service_1.invoiceService.getByBookingId(bookingId, skipNum, takeNum);
            res.json({
                message: "Invoices retrieved successfully",
                data: invoices,
                pagination: {
                    skip: skipNum,
                    take: takeNum,
                    total,
                    pages: Math.ceil(total / takeNum),
                },
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * PATCH /api/invoices/:id/send
     * Send invoice (mark as sent and generate payment link)
     */
    send: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            const { paymentLink } = req.body;
            const invoice = await invoice_service_1.invoiceService.send(id, paymentLink);
            res.json({
                message: "Invoice sent successfully",
                data: invoice,
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * PATCH /api/invoices/:id/status
     * Update invoice status
     */
    updateStatus: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            const { status } = invoice_validation_1.updateInvoiceStatusSchema.parse(req.body);
            const invoice = await invoice_service_1.invoiceService.updateStatus(id, status);
            res.json({
                message: "Invoice status updated successfully",
                data: invoice,
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * POST /api/invoices/:id/payments
     * Record a payment for an invoice
     */
    recordPayment: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            const paymentData = {
                invoiceId: id,
                ...req.body,
            };
            // Validate manually since we need the ID from params
            if (typeof paymentData.transactionId !== "string") {
                throw ApiError_1.ApiError.badRequest("Transaction ID is required");
            }
            if (!["DEPOSIT", "BALANCE"].includes(paymentData.type)) {
                throw ApiError_1.ApiError.badRequest("Invalid transaction type");
            }
            if (typeof paymentData.amount !== "number" || paymentData.amount <= 0) {
                throw ApiError_1.ApiError.badRequest("Amount must be a positive number");
            }
            const { transaction, invoice } = await invoice_service_1.invoiceService.recordPayment(paymentData);
            res.status(201).json({
                message: "Payment recorded successfully",
                data: {
                    transaction,
                    invoice,
                },
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * GET /api/invoices/:id/transactions
     * Get transactions for an invoice
     */
    getTransactions: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            const transactions = await invoice_service_1.invoiceService.getTransactions(id);
            res.json({
                message: "Transactions retrieved successfully",
                data: transactions,
            });
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
    /**
     * DELETE /api/invoices/:id
     * Delete invoice (only if in DRAFT status)
     */
    delete: async (req, res) => {
        try {
            const { id } = invoice_validation_1.invoiceIdSchema.parse(req.params);
            await invoice_service_1.invoiceService.delete(id);
            res.status(204).send();
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.code,
                });
            }
            else {
                throw error;
            }
        }
    },
};
//# sourceMappingURL=invoice.controller.old.js.map