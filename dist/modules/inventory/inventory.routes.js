"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = void 0;
const express_1 = require("express");
const inventory_controller_1 = require("./inventory.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.inventoryRoutes = (0, express_1.Router)();
exports.inventoryRoutes.use(auth_1.authenticate);
/**
 * @openapi
 * /api/inventory:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Create a new inventory item
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
 *               - description
 *               - partnerId
 *               - unitPrice
 *             properties:
 *               name:
 *                 type: string
 *                 example: 3-Day Safari Package
 *               description:
 *                 type: string
 *                 example: Includes accommodation, meals, and game drives
 *               partnerId:
 *                 type: string
 *                 format: uuid
 *               unitPrice:
 *                 type: number
 *                 example: 1500.00
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *                 example: USD
 *               quantityAvailable:
 *                 type: integer
 *                 example: 10
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, OUT_OF_STOCK, DISCONTINUED]
 *                 example: AVAILABLE
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.inventoryRoutes.post("/", (0, role_1.requireRoles)("ADMIN", "MANAGER"), inventory_controller_1.inventoryController.create);
/**
 * @openapi
 * /api/inventory:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: List all inventory items with pagination and filters
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
 *         name: partnerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, OUT_OF_STOCK, DISCONTINUED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search by item name or description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: name:asc
 *     responses:
 *       200:
 *         description: Inventory items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
exports.inventoryRoutes.get("/", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), inventory_controller_1.inventoryController.list);
/**
 * @openapi
 * /api/inventory/{id}:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Get inventory item by ID
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
 *         description: Inventory item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.inventoryRoutes.get("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER", "AGENT"), inventory_controller_1.inventoryController.getById);
/**
 * @openapi
 * /api/inventory/{id}:
 *   patch:
 *     tags:
 *       - Inventory
 *     summary: Update inventory item
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
 *               description:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               quantityAvailable:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, OUT_OF_STOCK, DISCONTINUED]
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 */
exports.inventoryRoutes.patch("/:id", (0, role_1.requireRoles)("ADMIN", "MANAGER"), inventory_controller_1.inventoryController.update);
/**
 * @openapi
 * /api/inventory/{id}:
 *   delete:
 *     tags:
 *       - Inventory
 *     summary: Delete inventory item
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
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.inventoryRoutes.delete("/:id", (0, role_1.requireRoles)("ADMIN"), inventory_controller_1.inventoryController.remove);
//# sourceMappingURL=inventory.routes.js.map