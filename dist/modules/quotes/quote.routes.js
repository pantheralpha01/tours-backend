"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteRoutes = void 0;
const express_1 = require("express");
const quote_controller_1 = require("./quote.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.quoteRoutes = (0, express_1.Router)();
exports.quoteRoutes.use(auth_1.authenticate);
exports.quoteRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/quotes:
 *   post:
 *     tags:
 *       - Quotes
 *     summary: Create a new quote
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
 *               - title
 *               - amount
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 example: Safari Package Quote
 *               amount:
 *                 type: number
 *                 example: 1500
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: object
 *               notes:
 *                 type: string
 *               agentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Quote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.quoteRoutes.post("/", quote_controller_1.quoteController.create);
/**
 * @openapi
 * /api/quotes:
 *   get:
 *     tags:
 *       - Quotes
 *     summary: List quotes with pagination and filters
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
 *           enum: [DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: agentId
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
 *         description: Quotes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.quoteRoutes.get("/", quote_controller_1.quoteController.list);
/**
 * @openapi
 * /api/quotes/{id}:
 *   get:
 *     tags:
 *       - Quotes
 *     summary: Get quote by ID
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
 *         description: Quote retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       404:
 *         description: Quote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.quoteRoutes.get("/:id", quote_controller_1.quoteController.getById);
/**
 * @openapi
 * /api/quotes/{id}:
 *   patch:
 *     tags:
 *       - Quotes
 *     summary: Update quote
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
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               items:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quote updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 */
exports.quoteRoutes.patch("/:id", quote_controller_1.quoteController.update);
/**
 * @openapi
 * /api/quotes/{id}:
 *   delete:
 *     tags:
 *       - Quotes
 *     summary: Delete quote
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
 *         description: Quote deleted successfully
 *       404:
 *         description: Quote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.quoteRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), quote_controller_1.quoteController.remove);
//# sourceMappingURL=quote.routes.js.map