import { Request, Response } from "express";
import {
  airtableSyncSchema,
  paymentIntentSchema,
  respondWebhookSchema,
  sendWhatsappSchema,
} from "./integration.validation";
import { twilioService } from "../../integrations/twilio";
import { respondService } from "../../integrations/respond";
import { airtableService } from "../../integrations/airtable";
import { paymentGatewayService } from "../../integrations/payment-gateway";

export const integrationController = {
  sendWhatsapp: async (req: Request, res: Response) => {
    const payload = sendWhatsappSchema.parse(req.body);
    const result = await twilioService.sendWhatsappMessage(
      payload.to,
      payload.message
    );
    return res.status(200).json(result);
  },

  respondWebhook: async (req: Request, res: Response) => {
    const payload = respondWebhookSchema.parse(req.body);
    const result = await respondService.handleWebhook(payload);
    return res.status(200).json(result);
  },

  airtableSync: async (req: Request, res: Response) => {
    const payload = airtableSyncSchema.parse(req.body);
    const result = await airtableService.syncProviders(payload.action, payload.table);
    return res.status(200).json(result);
  },

  createPaymentIntent: async (req: Request, res: Response) => {
    const payload = paymentIntentSchema.parse(req.body);
    const result = await paymentGatewayService.createIntent({
      provider: payload.provider,
      amount: payload.amount,
      currency: payload.currency ?? "USD",
      reference: payload.reference,
    });
    return res.status(200).json(result);
  },
};
