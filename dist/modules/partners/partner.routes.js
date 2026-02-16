"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerRoutes = void 0;
const express_1 = require("express");
const partner_controller_1 = require("./partner.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.partnerRoutes = (0, express_1.Router)();
exports.partnerRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/partners:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Create a new partner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Safari Adventures Ltd
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contact@safariventures.com
 *               phone:
 *                 type: string
 *                 example: +254712345678
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Partner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.post("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.create);
/**
 * @openapi
 * /api/partners:
 *   get:
 *     tags:
 *       - Partners
 *     summary: List all partners with pagination and filters
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
 *         name: partnerType
 *         schema:
 *           type: string
 *           enum: [TOUR_OPERATOR, HOTEL, TRANSPORT]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search by partner name
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - in: query
 *         name: createdById
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: name:asc
 *     responses:
 *       200:
 *         description: Partners retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.partnerRoutes.get("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.list);
/**
 * @openapi
 * /api/partners/{id}:
 *   get:
 *     tags:
 *       - Partners
 *     summary: Get partner by ID
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
 *         description: Partner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 *       404:
 *         description: Partner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.get("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.getById);
/**
 * @openapi
 * /api/partners/{id}:
 *   patch:
 *     tags:
 *       - Partners
 *     summary: Update partner
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               approvalStatus:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *               rejectedReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.patch("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.update);
/**
 * @openapi
 * /api/partners/{id}/approve:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Approve partner
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
 *         description: Partner approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.post("/:id/approve", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.approve);
/**
 * @openapi
 * /api/partners/{id}/reject:
 *   post:
 *     tags:
 *       - Partners
 *     summary: Reject partner
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
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partner'
 */
exports.partnerRoutes.post("/:id/reject", (0, role_1.requireRoles)("ADMIN", "MANAGER"), partner_controller_1.partnerController.reject);
/**
 * @openapi
 * /api/partners/{id}/events:
 *   get:
 *     tags:
 *       - Partners
 *     summary: List partner approval events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [APPROVED, REJECTED]
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
 *         description: Partner events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.partnerRoutes.get("/:id/events", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), partner_controller_1.partnerController.listEvents);
/**
 * @openapi
 * /api/partners/{id}:
 *   delete:
 *     tags:
 *       - Partners
 *     summary: Delete partner
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
 *         description: Partner deleted successfully
 *       404:
 *         description: Partner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.partnerRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), partner_controller_1.partnerController.remove);
//# sourceMappingURL=partner.routes.js.map