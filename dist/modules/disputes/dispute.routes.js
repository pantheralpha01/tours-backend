"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeRoutes = void 0;
const express_1 = require("express");
const dispute_controller_1 = require("./dispute.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.disputeRoutes = (0, express_1.Router)();
exports.disputeRoutes.use(auth_1.authenticate);
exports.disputeRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/disputes:
 *   post:
 *     tags:
 *       - Disputes
 *     summary: Create a new dispute
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
 *               - reason
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               reason:
 *                 type: string
 *                 example: Service not delivered
 *               description:
 *                 type: string
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Dispute created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.disputeRoutes.post("/", dispute_controller_1.disputeController.create);
/**
 * @openapi
 * /api/disputes:
 *   get:
 *     tags:
 *       - Disputes
 *     summary: List disputes with pagination and filters
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
 *           enum: [OPEN, UNDER_REVIEW, RESOLVED, REJECTED]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: openedById
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: assignedToId
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
 *         description: Disputes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.disputeRoutes.get("/", dispute_controller_1.disputeController.list);
/**
 * @openapi
 * /api/disputes/{id}:
 *   get:
 *     tags:
 *       - Disputes
 *     summary: Get dispute by ID
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
 *         description: Dispute retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 *       404:
 *         description: Dispute not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.disputeRoutes.get("/:id", dispute_controller_1.disputeController.getById);
/**
 * @openapi
 * /api/disputes/{id}:
 *   put:
 *     tags:
 *       - Disputes
 *     summary: Update dispute
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
 *                 enum: [OPEN, UNDER_REVIEW, RESOLVED, REJECTED]
 *               reason:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *               resolvedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Dispute updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 */
exports.disputeRoutes.put("/:id", dispute_controller_1.disputeController.update);
/**
 * @openapi
 * /api/disputes/{id}:
 *   delete:
 *     tags:
 *       - Disputes
 *     summary: Delete dispute
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
 *         description: Dispute deleted successfully
 *       404:
 *         description: Dispute not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.disputeRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), dispute_controller_1.disputeController.remove);
//# sourceMappingURL=dispute.routes.js.map