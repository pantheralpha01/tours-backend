import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";
import { escrowController } from "./escrow.controller";

export const escrowRoutes = Router();
escrowRoutes.use(authenticate);

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
escrowRoutes.get("/:bookingId", requireRoles("ADMIN", "MANAGER", "AGENT"), escrowController.getByBooking);

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
escrowRoutes.post(
  "/:bookingId/release",
  requireRoles("ADMIN", "MANAGER"),
  escrowController.release
);

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
escrowRoutes.patch(
  "/:bookingId/payouts/:payoutId/status",
  requireRoles("ADMIN", "MANAGER"),
  escrowController.updatePayoutStatus
);

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
escrowRoutes.post(
  "/:bookingId/cancel",
  requireRoles("ADMIN", "MANAGER"),
  escrowController.cancel
);
