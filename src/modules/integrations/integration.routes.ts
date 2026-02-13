import { Router } from "express";
import { integrationController } from "./integration.controller";
import { authenticate } from "../../middleware/auth";
import { requireRoles } from "../../middleware/role";

export const integrationRoutes = Router();

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
integrationRoutes.post(
  "/respond/webhook",
  integrationController.respondWebhook
);

integrationRoutes.use(authenticate);
integrationRoutes.use(requireRoles("ADMIN", "MANAGER"));

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
integrationRoutes.post("/whatsapp/send", integrationController.sendWhatsapp);

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
integrationRoutes.post("/airtable/sync", integrationController.airtableSync);

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
integrationRoutes.post(
  "/payments/intent",
  integrationController.createPaymentIntent
);