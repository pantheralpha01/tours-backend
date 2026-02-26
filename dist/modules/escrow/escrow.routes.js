"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
const escrow_controller_1 = require("./escrow.controller");
exports.escrowRoutes = (0, express_1.Router)();
exports.escrowRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/escrow/{bookingId}:
 *   get:
 *     tags:
 *       - Escrow
 *     summary: Get escrow account for a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Escrow account returned
 *       404:
 *         description: Escrow account not found
 */
exports.escrowRoutes.get("/:bookingId", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), escrow_controller_1.escrowController.getByBooking);
/**
 * @openapi
 * /api/escrow/{bookingId}/release:
 *   post:
 *     tags:
 *       - Escrow
 *     summary: Schedule or release payout from escrow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               notes:
 *                 type: string
 *               releaseAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Payout scheduled
 */
exports.escrowRoutes.post("/:bookingId/release", (0, role_1.requireRoles)("ADMIN", "MANAGER"), escrow_controller_1.escrowController.release);
/**
 * @openapi
 * /api/escrow/{bookingId}/payouts/{payoutId}/status:
 *   patch:
 *     tags:
 *       - Escrow
 *     summary: Update payout status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: payoutId
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, SENT, CANCELLED]
 *               transactionReference:
 *                 type: string
 *               notes:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payout status updated
 */
exports.escrowRoutes.patch("/:bookingId/payouts/:payoutId/status", (0, role_1.requireRoles)("ADMIN", "MANAGER"), escrow_controller_1.escrowController.updatePayoutStatus);
/**
 * @openapi
 * /api/escrow/{bookingId}/cancel:
 *   post:
 *     tags:
 *       - Escrow
 *     summary: Cancel pending escrow release
 *     security:
 *       - bearerAuth: []
 */
exports.escrowRoutes.post("/:bookingId/cancel", (0, role_1.requireRoles)("ADMIN", "MANAGER"), escrow_controller_1.escrowController.cancel);
//# sourceMappingURL=escrow.routes.js.map