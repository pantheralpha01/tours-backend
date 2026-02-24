import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";

export const dashboardRoutes = Router();

dashboardRoutes.use(authenticate);
dashboardRoutes.use(requireRoles("ADMIN", "MANAGER", "AGENT"));

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Retrieve aggregate metrics for the portal dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingsInProgress:
 *                   type: integer
 *                 pendingPartnerApprovals:
 *                   type: integer
 *                 openDisputes:
 *                   type: integer
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 */
dashboardRoutes.get("/summary", dashboardController.summary);
