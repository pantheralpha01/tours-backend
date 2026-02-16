"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentGatewayService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const providerConfigured = (provider) => {
    if (provider === "PAYPAL") {
        return Boolean(config_1.config.paypalClientId && config_1.config.paypalClientSecret);
    }
    if (provider === "MPESA") {
        return Boolean(config_1.config.mpesaConsumerKey &&
            config_1.config.mpesaConsumerSecret &&
            config_1.config.mpesaShortCode &&
            config_1.config.mpesaPasskey &&
            config_1.config.mpesaCallbackUrl);
    }
    if (provider === "VISA" || provider === "MASTERCARD") {
        return Boolean(config_1.config.cardGatewayKey);
    }
    if (provider === "STRIPE") {
        return true;
    }
    return false;
};
exports.paymentGatewayService = {
    createIntent: async (data) => {
        if (!providerConfigured(data.provider)) {
            throw ApiError_1.ApiError.badRequest(`${data.provider} gateway is not configured`, "PAYMENT_GATEWAY_NOT_CONFIGURED");
        }
        return {
            provider: data.provider,
            amount: data.amount,
            currency: data.currency,
            reference: data.reference ?? `INTENT_${Date.now()}`,
            status: "created",
        };
    },
};
//# sourceMappingURL=payment-gateway.js.map