"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const payment_service_1 = require("./payment.service");
const payment_validation_1 = require("./payment.validation");
const pagination_1 = require("../../utils/pagination");
const config_1 = require("../../config");
const ApiError_1 = require("../../utils/ApiError");
const payment_webhook_adapters_1 = require("./payment.webhook-adapters");
const getProviderSecret = (provider) => {
    if (provider === "STRIPE" && config_1.config.stripeWebhookSecret) {
        return config_1.config.stripeWebhookSecret;
    }
    if (provider === "MPESA" && config_1.config.mpesaWebhookSecret) {
        return config_1.config.mpesaWebhookSecret;
    }
    if (provider === "PAYPAL" && config_1.config.paypalWebhookSecret) {
        return config_1.config.paypalWebhookSecret;
    }
    return config_1.config.paymentWebhookSecret || null;
};
const extractSignatureValue = (signatureHeader) => {
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
const verifyWebhookSignature = (options) => {
    const secret = getProviderSecret(options.provider);
    if (!secret) {
        return;
    }
    const signature = extractSignatureValue(options.signatureHeader);
    if (!signature) {
        throw ApiError_1.ApiError.forbidden("Missing webhook signature");
    }
    const computed = crypto_1.default
        .createHmac("sha256", secret)
        .update(options.rawBody)
        .digest("hex");
    const expected = Buffer.from(computed, "hex");
    const received = Buffer.from(signature, "hex");
    if (expected.length !== received.length ||
        !crypto_1.default.timingSafeEqual(expected, received)) {
        throw ApiError_1.ApiError.forbidden("Invalid webhook signature");
    }
};
exports.paymentController = {
    create: async (req, res) => {
        const payload = payment_validation_1.createPaymentSchema.parse(req.body);
        const payment = await payment_service_1.paymentService.create({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(payment);
    },
    initiate: async (req, res) => {
        const payload = payment_validation_1.initiatePaymentSchema.parse(req.body);
        const result = await payment_service_1.paymentService.initiate({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(result);
    },
    manual: async (req, res) => {
        const payload = payment_validation_1.manualPaymentSchema.parse(req.body);
        const payment = await payment_service_1.paymentService.registerManual({
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(201).json(payment);
    },
    list: async (req, res) => {
        const params = pagination_1.paginationSchema.parse(req.query);
        const result = await payment_service_1.paymentService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        const payment = await payment_service_1.paymentService.getById(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        return res.status(200).json(payment);
    },
    update: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        const payload = payment_validation_1.updatePaymentSchema.parse(req.body);
        const payment = await payment_service_1.paymentService.update(id, payload);
        return res.status(200).json(payment);
    },
    remove: async (req, res) => {
        const { id } = payment_validation_1.paymentIdSchema.parse(req.params);
        await payment_service_1.paymentService.remove(id);
        return res.status(204).send();
    },
    webhook: async (req, res) => {
        const { provider } = payment_validation_1.webhookProviderParamSchema.parse(req.params);
        const rawPayload = req.body ?? {};
        const normalized = (0, payment_webhook_adapters_1.normalizeWebhookPayload)({ provider, payload: rawPayload });
        const payload = payment_validation_1.paymentWebhookSchema.parse(normalized);
        const rawBody = req.rawBody ?? JSON.stringify(req.body ?? {});
        verifyWebhookSignature({
            provider,
            signatureHeader: req.headers["x-webhook-signature"] ?? req.headers["stripe-signature"],
            rawBody,
        });
        const result = await payment_service_1.paymentService.processWebhookEvent({
            provider,
            reference: payload.reference,
            status: payload.status,
            amount: payload.amount,
            currency: payload.currency,
            eventType: payload.eventType,
            metadata: payload.metadata,
            rawPayload,
            headers: req.headers,
            eventId: payload.eventId,
            reason: payload.reason,
        });
        return res.status(202).json({ status: "accepted", result });
    },
};
//# sourceMappingURL=payment.controller.js.map