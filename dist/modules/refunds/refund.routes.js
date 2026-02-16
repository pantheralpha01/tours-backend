"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundRoutes = void 0;
const express_1 = require("express");
const refund_controller_1 = require("./refund.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.refundRoutes = (0, express_1.Router)();
exports.refundRoutes.use(auth_1.authenticate);
exports.refundRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/refunds:
 *   post:
 *     tags:
 *       - Refunds
 *     summary: Create a new refund
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
 *               - amount
 *               - reason
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               paymentId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *                 example: 200
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               reason:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Refund created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refund'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.refundRoutes.post("/", refund_controller_1.refundController.create);
/**
 * @openapi
 * /api/refunds:
 *   get:
 *     tags:
 *       - Refunds
 *     summary: List refunds with pagination and filters
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
 *           enum: [REQUESTED, APPROVED, DECLINED, PROCESSING, COMPLETED, FAILED]
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
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Refunds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.refundRoutes.get("/", refund_controller_1.refundController.list);
/**
 * @openapi
 * /api/refunds/{id}:
 *   get:
 *     tags:
 *       - Refunds
 *     summary: Get refund by ID
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
 *         description: Refund retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refund'
 *       404:
 *         description: Refund not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.refundRoutes.get("/:id", refund_controller_1.refundController.getById);
/**
 * @openapi
 * /api/refunds/{id}:
 *   put:
 *     tags:
 *       - Refunds
 *     summary: Update refund
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
 *                 enum: [REQUESTED, APPROVED, DECLINED, PROCESSING, COMPLETED, FAILED]
 *               reference:
 *                 type: string
 *               processedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Refund updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refund'
 */
exports.refundRoutes.put("/:id", refund_controller_1.refundController.update);
/**
 * @openapi
 * /api/refunds/{id}:
 *   delete:
 *     tags:
 *       - Refunds
 *     summary: Delete refund
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
 *         description: Refund deleted successfully
 *       404:
 *         description: Refund not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.refundRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), refund_controller_1.refundController.remove);
//# sourceMappingURL=refund.routes.js.map