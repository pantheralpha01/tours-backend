"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptRoutes = void 0;
const express_1 = require("express");
const receipt_controller_1 = require("./receipt.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.receiptRoutes = (0, express_1.Router)();
exports.receiptRoutes.use(auth_1.authenticate);
exports.receiptRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/receipts:
 *   post:
 *     tags:
 *       - Receipts
 *     summary: Create a new receipt
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
 *               - paymentId
 *               - receiptNumber
 *               - amount
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               paymentId:
 *                 type: string
 *                 format: uuid
 *               receiptNumber:
 *                 type: string
 *                 example: RCPT-2026-0001
 *               amount:
 *                 type: number
 *                 example: 1500
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               status:
 *                 type: string
 *                 enum: [ISSUED, VOID]
 *               issuedAt:
 *                 type: string
 *                 format: date-time
 *               fileUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Receipt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.receiptRoutes.post("/", receipt_controller_1.receiptController.create);
/**
 * @openapi
 * /api/receipts:
 *   get:
 *     tags:
 *       - Receipts
 *     summary: List receipts with pagination and filters
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
 *           enum: [ISSUED, VOID]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: paymentId
 *         schema:
 *           type: string
 *           format: uuid
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
 *           example: issuedAt:desc
 *     responses:
 *       200:
 *         description: Receipts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.receiptRoutes.get("/", receipt_controller_1.receiptController.list);
/**
 * @openapi
 * /api/receipts/{id}:
 *   get:
 *     tags:
 *       - Receipts
 *     summary: Get receipt by ID
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
 *         description: Receipt retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Receipt not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.receiptRoutes.get("/:id", receipt_controller_1.receiptController.getById);
/**
 * @openapi
 * /api/receipts/{id}:
 *   patch:
 *     tags:
 *       - Receipts
 *     summary: Update receipt
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
 *               status:
 *                 type: string
 *                 enum: [ISSUED, VOID]
 *               fileUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Receipt updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 */
exports.receiptRoutes.patch("/:id", receipt_controller_1.receiptController.update);
/**
 * @openapi
 * /api/receipts/{id}:
 *   delete:
 *     tags:
 *       - Receipts
 *     summary: Delete receipt
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
 *         description: Receipt deleted successfully
 *       404:
 *         description: Receipt not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.receiptRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), receipt_controller_1.receiptController.remove);
//# sourceMappingURL=receipt.routes.js.map