"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchRoutes = void 0;
const express_1 = require("express");
const dispatch_controller_1 = require("./dispatch.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.dispatchRoutes = (0, express_1.Router)();
exports.dispatchRoutes.use(auth_1.authenticate);
exports.dispatchRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
/**
 * @openapi
 * /api/dispatches:
 *   post:
 *     tags:
 *       - Dispatch
 *     summary: Create a new dispatch
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
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Dispatch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispatch'
 */
exports.dispatchRoutes.post("/", dispatch_controller_1.dispatchController.create);
/**
 * @openapi
 * /api/dispatches:
 *   get:
 *     tags:
 *       - Dispatch
 *     summary: List dispatches with pagination and filters
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
 *           enum: [PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt:desc
 *     responses:
 *       200:
 *         description: Dispatches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.dispatchRoutes.get("/", dispatch_controller_1.dispatchController.list);
/**
 * @openapi
 * /api/dispatches/{id}:
 *   get:
 *     tags:
 *       - Dispatch
 *     summary: Get dispatch by ID
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
 *         description: Dispatch retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispatch'
 *       404:
 *         description: Dispatch not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.dispatchRoutes.get("/:id", dispatch_controller_1.dispatchController.getById);
/**
 * @openapi
 * /api/dispatches/{id}:
 *   put:
 *     tags:
 *       - Dispatch
 *     summary: Update dispatch
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
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Dispatch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispatch'
 */
exports.dispatchRoutes.put("/:id", dispatch_controller_1.dispatchController.update);
/**
 * @openapi
 * /api/dispatches/{id}:
 *   delete:
 *     tags:
 *       - Dispatch
 *     summary: Delete dispatch
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
 *         description: Dispatch deleted successfully
 *       404:
 *         description: Dispatch not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.dispatchRoutes.delete("/:id", dispatch_controller_1.dispatchController.remove);
/**
 * @openapi
 * /api/dispatches/{id}/track:
 *   post:
 *     tags:
 *       - Dispatch
 *     summary: Add dispatch tracking point
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
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               recordedAt:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Tracking point added successfully
 */
exports.dispatchRoutes.post("/:id/track", dispatch_controller_1.dispatchController.addTrackPoint);
/**
 * @openapi
 * /api/dispatches/{id}/track:
 *   get:
 *     tags:
 *       - Dispatch
 *     summary: List dispatch tracking points
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
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Tracking points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.dispatchRoutes.get("/:id/track", dispatch_controller_1.dispatchController.listTrackPoints);
/**
 * @openapi
 * /api/dispatches/{id}/timeline:
 *   get:
 *     tags:
 *       - Dispatch
 *     summary: Get combined dispatch timeline (events + track points)
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
 *           default: 50
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
 *     responses:
 *       200:
 *         description: Timeline retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.dispatchRoutes.get("/:id/timeline", dispatch_controller_1.dispatchController.timeline);
//# sourceMappingURL=dispatch.routes.js.map