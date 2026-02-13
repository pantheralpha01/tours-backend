import { Router } from "express";
import { dispatchController } from "./dispatch.controller";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";

export const dispatchRoutes = Router();

dispatchRoutes.use(authenticate);
dispatchRoutes.use(requireRoles("ADMIN", "MANAGER", "AGENT"));

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
dispatchRoutes.post("/", dispatchController.create);

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
dispatchRoutes.get("/", dispatchController.list);

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
dispatchRoutes.get("/:id", dispatchController.getById);

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
dispatchRoutes.put("/:id", dispatchController.update);

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
dispatchRoutes.delete("/:id", dispatchController.remove);

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
dispatchRoutes.post("/:id/track", dispatchController.addTrackPoint);

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
dispatchRoutes.get("/:id/track", dispatchController.listTrackPoints);

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
dispatchRoutes.get("/:id/timeline", dispatchController.timeline);
