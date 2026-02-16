"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.paymentRoutes = (0, express_1.Router)();
exports.paymentRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - provider
 *               - amount
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               provider:
 *                 type: string
 *                 enum: [MPESA, STRIPE, PAYPAL, VISA, MASTERCARD]
 *                 example: STRIPE
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *                 example: USD
 *               reference:
 *                 type: string
 *                 example: PAY_12345
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.paymentRoutes.post("/", (0, role_1.requireRoles)("ADMIN", "MANAGER"), payment_controller_1.paymentController.create);
/**
 * @openapi
 * /api/payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: List all payments with pagination and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [INITIATED, PENDING, COMPLETED, FAILED, CANCELLED]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.paymentRoutes.get("/", (0, role_1.requireRoles)("ADMIN", "MANAGER"), payment_controller_1.paymentController.list);
/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payment by ID
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
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.paymentRoutes.get("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER"), payment_controller_1.paymentController.getById);
/**
 * @openapi
 * /api/payments/{id}:
 *   put:
 *     tags:
 *       - Payments
 *     summary: Update payment
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
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [INITIATED, PENDING, COMPLETED, FAILED, CANCELLED]
 *               reference:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
exports.paymentRoutes.put("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER"), payment_controller_1.paymentController.update);
/**
 * @openapi
 * /api/payments/{id}:
 *   delete:
 *     tags:
 *       - Payments
 *     summary: Delete payment
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
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.paymentRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), payment_controller_1.paymentController.remove);
//# sourceMappingURL=payment.routes.js.map