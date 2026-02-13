import { Router } from "express";
import { contractController } from "./contract.controller";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";

export const contractRoutes = Router();

contractRoutes.use(authenticate);
contractRoutes.use(requireRoles("ADMIN", "MANAGER", "AGENT"));

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
contractRoutes.post("/", contractController.create);

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
contractRoutes.get("/", contractController.list);

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
contractRoutes.get("/:id", contractController.getById);

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
contractRoutes.patch("/:id", contractController.update);

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
contractRoutes.delete("/:id", requireRoles("ADMIN"), contractController.remove);
