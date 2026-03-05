"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRoutes = void 0;
const express_1 = require("express");
const invoice_controller_1 = require("./invoice.controller");
const auth_1 = require("../../middleware/auth");
exports.invoiceRoutes = (0, express_1.Router)();
/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     description: Create a new invoice from a booking with auto-generated invoice number
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvoiceRequest'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoice created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Booking not found
 */
exports.invoiceRoutes.post("/", auth_1.authenticate, invoice_controller_1.invoiceController.create);
/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: List invoices
 *     description: Get all invoices with optional filtering and pagination
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, SENT, PARTIALLY_PAID, PAID, OVERDUE]
 *         description: Filter by invoice status
 *       - in: query
 *         name: customerEmail
 *         schema:
 *           type: string
 *           format: email
 *         description: Filter by customer email
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by booking ID
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoices retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
exports.invoiceRoutes.get("/", auth_1.authenticate, invoice_controller_1.invoiceController.list);
/**
 * @swagger
 * /invoices/booking/{bookingId}:
 *   get:
 *     summary: Get invoices by booking
 *     description: Retrieve all invoices associated with a specific booking
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The booking ID
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
exports.invoiceRoutes.get("/booking/:bookingId", auth_1.authenticate, invoice_controller_1.invoiceController.getByBookingId);
/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     description: Retrieve detailed information about a specific invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/InvoiceResponse'
 *       404:
 *         description: Invoice not found
 */
exports.invoiceRoutes.get("/:id", auth_1.authenticate, invoice_controller_1.invoiceController.getById);
/**
 * @swagger
 * /invoices/{id}/send:
 *   patch:
 *     summary: Send invoice to customer
 *     description: Mark invoice as sent and optionally set payment link. Only works if invoice is in DRAFT status.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentLink:
 *                 type: string
 *                 format: uri
 *                 example: "https://stripe.com/pay/invoice123"
 *     responses:
 *       200:
 *         description: Invoice sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Cannot send invoice - invalid status
 *       404:
 *         description: Invoice not found
 */
exports.invoiceRoutes.patch("/:id/send", auth_1.authenticate, invoice_controller_1.invoiceController.send);
/**
 * @swagger
 * /invoices/{id}/status:
 *   patch:
 *     summary: Update invoice status
 *     description: Update invoice status with state machine validation. Valid transitions are enforced.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SENT, PARTIALLY_PAID, PAID, OVERDUE]
 *                 example: "PARTIALLY_PAID"
 *     responses:
 *       200:
 *         description: Invoice status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Invoice not found
 */
exports.invoiceRoutes.patch("/:id/status", auth_1.authenticate, invoice_controller_1.invoiceController.updateStatus);
/**
 * @swagger
 * /invoices/{id}/payments:
 *   post:
 *     summary: Record payment for invoice
 *     description: Record a payment transaction against an invoice. Updates invoice amounts and status automatically.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transactionId, type, amount]
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: "stripe_charge_123"
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, BALANCE]
 *               amount:
 *                 type: number
 *                 example: 1500
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *                 default: "KES"
 *               paymentMethod:
 *                 type: string
 *                 example: "STRIPE"
 *               reference:
 *                 type: string
 *                 example: "INVOICE_001"
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *                     invoice:
 *                       $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Payment amount exceeds remaining balance
 *       404:
 *         description: Invoice not found
 *       409:
 *         description: Transaction already exists
 */
exports.invoiceRoutes.post("/:id/payments", auth_1.authenticate, invoice_controller_1.invoiceController.recordPayment);
/**
 * @swagger
 * /invoices/{id}/transactions:
 *   get:
 *     summary: Get invoice transactions
 *     description: Retrieve all payment transactions associated with an invoice
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Invoice not found
 */
exports.invoiceRoutes.get("/:id/transactions", auth_1.authenticate, invoice_controller_1.invoiceController.getTransactions);
/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     description: Delete an invoice. Only invoices in DRAFT status can be deleted.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Invoice deleted successfully
 *       400:
 *         description: Cannot delete invoice - invalid status
 *       404:
 *         description: Invoice not found
 */
exports.invoiceRoutes.delete("/:id", auth_1.authenticate, invoice_controller_1.invoiceController.delete);
exports.default = exports.invoiceRoutes;
//# sourceMappingURL=invoice.routes.js.map