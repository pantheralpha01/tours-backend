"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes.use(auth_1.authenticate);
exports.dashboardRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"));
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
exports.dashboardRoutes.get("/summary", dashboard_controller_1.dashboardController.summary);
//# sourceMappingURL=dashboard.routes.js.map