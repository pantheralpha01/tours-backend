import crypto from "crypto";
import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import {
  createPaymentSchema,
  initiatePaymentSchema,
  manualPaymentSchema,
  paymentIdSchema,
  updatePaymentSchema,
  webhookProviderParamSchema,
  paymentWebhookSchema,
} from "./payment.validation";
import { paginationSchema } from "../../utils/pagination";
import { config } from "../../config";
import { ApiError } from "../../utils/ApiError";
import { ExternalPaymentProvider } from "../../integrations/payment-gateway";
import { normalizeWebhookPayload } from "./payment.webhook-adapters";

const getProviderSecret = (
  provider: ExternalPaymentProvider
): string | null => {
  if (provider === "STRIPE" && config.stripeWebhookSecret) {
    return config.stripeWebhookSecret;
  }
  if (provider === "MPESA" && config.mpesaWebhookSecret) {
    return config.mpesaWebhookSecret;
  }
  if (provider === "PAYPAL" && config.paypalWebhookSecret) {
    return config.paypalWebhookSecret;
  }
  return config.paymentWebhookSecret || null;
};

const extractSignatureValue = (signatureHeader?: string | string[]): string | null => {
  if (!signatureHeader) {
    return null;
  }
  const raw = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!raw) {
    return null;
  }
  if (raw.includes("v1=")) {
    const segment = raw
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.startsWith("v1="));
    return segment ? segment.split("=")[1] : raw;
  }
  return raw;
};

const verifyWebhookSignature = (options: {
  provider: ExternalPaymentProvider;
  signatureHeader?: string | string[];
  rawBody: string;
}) => {
  const secret = getProviderSecret(options.provider);
  if (!secret) {
    return;
  }

  const signature = extractSignatureValue(options.signatureHeader);
  if (!signature) {
    throw ApiError.forbidden("Missing webhook signature");
  }

  const computed = crypto
    .createHmac("sha256", secret)
    .update(options.rawBody)
    .digest("hex");

  const expected = Buffer.from(computed, "hex");
  const received = Buffer.from(signature, "hex");

  if (
    expected.length !== received.length ||
    !crypto.timingSafeEqual(expected, received)
  ) {
    throw ApiError.forbidden("Invalid webhook signature");
  }
};

export const paymentController = {
  create: async (req: Request, res: Response) => {
    const payload = createPaymentSchema.parse(req.body);
    const payment = await paymentService.create({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(payment);
  },

  initiate: async (req: Request, res: Response) => {
    const payload = initiatePaymentSchema.parse(req.body);
    const result = await paymentService.initiate({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(result);
  },

  manual: async (req: Request, res: Response) => {
    const payload = manualPaymentSchema.parse(req.body);
    const payment = await paymentService.registerManual({
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(201).json(payment);
  },

  list: async (req: Request, res: Response) => {
    const params = paginationSchema.parse(req.query);
    const result = await paymentService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    const payment = await paymentService.getById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(payment);
  },

  update: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    const payload = updatePaymentSchema.parse(req.body);
    const payment = await paymentService.update(id, payload);
    return res.status(200).json(payment);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = paymentIdSchema.parse(req.params);
    await paymentService.remove(id);
    return res.status(204).send();
  },

  webhook: async (req: Request, res: Response) => {
    const { provider } = webhookProviderParamSchema.parse(req.params);
    const rawPayload = req.body ?? {};
    const normalized = normalizeWebhookPayload({ provider, payload: rawPayload });
    const payload = paymentWebhookSchema.parse(normalized);
    const rawBody = req.rawBody ?? JSON.stringify(req.body ?? {});

    verifyWebhookSignature({
      provider,
      signatureHeader:
        req.headers["x-webhook-signature"] ?? req.headers["stripe-signature"],
      rawBody,
    });

    const result = await paymentService.processWebhookEvent({
      provider,
      reference: payload.reference,
      status: payload.status,
      amount: payload.amount,
      currency: payload.currency,
      eventType: payload.eventType,
      metadata: payload.metadata,
      rawPayload,
      headers: req.headers as Record<string, unknown>,
      eventId: payload.eventId,
      reason: payload.reason,
    });

    return res.status(202).json({ status: "accepted", result });
  },
};
