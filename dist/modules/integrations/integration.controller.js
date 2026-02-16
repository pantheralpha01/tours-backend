"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationController = void 0;
const integration_validation_1 = require("./integration.validation");
const twilio_1 = require("../../integrations/twilio");
const respond_1 = require("../../integrations/respond");
const airtable_1 = require("../../integrations/airtable");
const payment_gateway_1 = require("../../integrations/payment-gateway");
exports.integrationController = {
    sendWhatsapp: async (req, res) => {
        const payload = integration_validation_1.sendWhatsappSchema.parse(req.body);
        const result = await twilio_1.twilioService.sendWhatsappMessage(payload.to, payload.message);
        return res.status(200).json(result);
    },
    respondWebhook: async (req, res) => {
        const payload = integration_validation_1.respondWebhookSchema.parse(req.body);
        const result = await respond_1.respondService.handleWebhook(payload);
        return res.status(200).json(result);
    },
    airtableSync: async (req, res) => {
        const payload = integration_validation_1.airtableSyncSchema.parse(req.body);
        const result = await airtable_1.airtableService.syncProviders(payload.action, payload.table);
        return res.status(200).json(result);
    },
    createPaymentIntent: async (req, res) => {
        const payload = integration_validation_1.paymentIntentSchema.parse(req.body);
        const result = await payment_gateway_1.paymentGatewayService.createIntent({
            provider: payload.provider,
            amount: payload.amount,
            currency: payload.currency ?? "USD",
            reference: payload.reference,
        });
        return res.status(200).json(result);
    },
};
//# sourceMappingURL=integration.controller.js.map