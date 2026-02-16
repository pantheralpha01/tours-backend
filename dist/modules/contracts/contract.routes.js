"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractRoutes = void 0;
const express_1 = require("express");
const contract_controller_1 = require("./contract.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.contractRoutes = (0, express_1.Router)();
exports.contractRoutes.use(auth_1.authenticate);
exports.contractRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/contracts:
 *   post:
 *     tags:
 *       - Contracts
 *     summary: Create a new contract
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               partnerId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, SIGNED, CANCELLED]
 *               fileUrl:
 *                 type: string
 *               signedAt:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Contract created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.contractRoutes.post("/", contract_controller_1.contractController.create);
/**
 * @openapi
 * /api/contracts:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: List contracts with pagination and filters
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
 *           enum: [DRAFT, SENT, SIGNED, CANCELLED]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: partnerId
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
 *         description: Contracts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.contractRoutes.get("/", contract_controller_1.contractController.list);
/**
 * @openapi
 * /api/contracts/{id}:
 *   get:
 *     tags:
 *       - Contracts
 *     summary: Get contract by ID
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
 *         description: Contract retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       404:
 *         description: Contract not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.contractRoutes.get("/:id", contract_controller_1.contractController.getById);
/**
 * @openapi
 * /api/contracts/{id}:
 *   patch:
 *     tags:
 *       - Contracts
 *     summary: Update contract
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
 *               partnerId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, SIGNED, CANCELLED]
 *               fileUrl:
 *                 type: string
 *               signedAt:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Contract updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 */
exports.contractRoutes.patch("/:id", contract_controller_1.contractController.update);
/**
 * @openapi
 * /api/contracts/{id}:
 *   delete:
 *     tags:
 *       - Contracts
 *     summary: Delete contract
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
 *         description: Contract deleted successfully
 *       404:
 *         description: Contract not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.contractRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), contract_controller_1.contractController.remove);
//# sourceMappingURL=contract.routes.js.map