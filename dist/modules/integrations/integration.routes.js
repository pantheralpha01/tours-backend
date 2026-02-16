"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationRoutes = void 0;
const express_1 = require("express");
const integration_controller_1 = require("./integration.controller");
const auth_1 = require("../../middleware/auth");
const role_1 = require("../../middleware/role");
exports.integrationRoutes = (0, express_1.Router)();
/**
 * @openapi
 * /api/integrations/respond/webhook:
 *   post:
 *     tags:
 *       - Integrations
 *     summary: Respond.io webhook receiver (stub)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
exports.integrationRoutes.post("/respond/webhook", integration_controller_1.integrationController.respondWebhook);
exports.integrationRoutes.use(auth_1.authenticate);
exports.integrationRoutes.use((0, role_1.requireRoles)("ADMIN", "MANAGER"));
/**
 * @openapi
 * /api/integrations/whatsapp/send:
 *   post:
 *     tags:
 *       - Integrations
 *     summary: Send a WhatsApp message via Twilio (stub)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message queued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
exports.integrationRoutes.post("/whatsapp/send", integration_controller_1.integrationController.sendWhatsapp);
/**
 * @openapi
 * /api/integrations/airtable/sync:
 *   post:
 *     tags:
 *       - Integrations
 *     summary: Trigger Airtable sync (stub)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [pull, push]
 *               table:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sync queued
 */
exports.integrationRoutes.post("/airtable/sync", integration_controller_1.integrationController.airtableSync);
/**
 * @openapi
 * /api/integrations/payments/intent:
 *   post:
 *     tags:
 *       - Integrations
 *     summary: Create external payment intent (stub)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - amount
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [MPESA, PAYPAL, VISA, MASTERCARD, STRIPE]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [USD, KES]
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Intent created
 */
exports.integrationRoutes.post("/payments/intent", integration_controller_1.integrationController.createPaymentIntent);
//# sourceMappingURL=integration.routes.js.map