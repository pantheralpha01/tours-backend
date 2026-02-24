import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { shiftController } from "./shift.controller";

export const shiftRoutes = Router();

shiftRoutes.use(authenticate);
shiftRoutes.use(requireRoles("ADMIN", "MANAGER", "AGENT"));

/**
 * @openapi
 * /api/shifts:
 *   post:
 *     tags:
 *       - Shifts
 *     summary: Create a new shift
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startAt
 *               - endAt
 *             properties:
 *               agentId:
 *                 type: string
 *                 format: uuid
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               startAt:
 *                 type: string
 *                 format: date-time
 *               endAt:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shift created successfully
 *       400:
 *         description: Validation error
 */
shiftRoutes.post("/", shiftController.create);

/**
 * @openapi
 * /api/shifts:
 *   get:
 *     tags:
 *       - Shifts
 *     summary: List shifts with pagination and filters
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
 *         name: agentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: startTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: bookingId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shifts retrieved successfully
 */
shiftRoutes.get("/", shiftController.list);

/**
 * @openapi
 * /api/shifts/{id}:
 *   get:
 *     tags:
 *       - Shifts
 *     summary: Get shift by ID
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
 *         description: Shift retrieved successfully
 *       404:
 *         description: Shift not found
 */
shiftRoutes.get("/:id", shiftController.getById);

/**
 * @openapi
 * /api/shifts/{id}:
 *   patch:
 *     tags:
 *       - Shifts
 *     summary: Update shift details
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
 *               agentId:
 *                 type: string
 *                 format: uuid
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               startAt:
 *                 type: string
 *                 format: date-time
 *               endAt:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shift updated successfully
 */
shiftRoutes.patch("/:id", shiftController.update);

/**
 * @openapi
 * /api/shifts/{id}:
 *   delete:
 *     tags:
 *       - Shifts
 *     summary: Delete shift
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
 *         description: Shift deleted successfully
 */
shiftRoutes.delete("/:id", shiftController.remove);
