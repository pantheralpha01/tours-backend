"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentGatewayService = void 0;
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const stripe_1 = __importDefault(require("stripe"));
let stripeClient = null;
const getStripeClient = () => {
    if (!stripeClient) {
        if (!config_1.config.stripeSecretKey) {
            throw new Error("Stripe secret key is not configured");
        }
        stripeClient = new stripe_1.default(config_1.config.stripeSecretKey);
    }
    return stripeClient;
};
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
        return Boolean(config_1.config.stripeSecretKey && config_1.config.stripePublishableKey);
    }
    if (provider === "CRYPTO") {
        return Boolean(config_1.config.cryptoWalletAddress);
    }
    return false;
};
exports.paymentGatewayService = {
    createIntent: async (data) => {
        if (!providerConfigured(data.provider)) {
            throw ApiError_1.ApiError.badRequest(`${data.provider} gateway is not configured`, "PAYMENT_GATEWAY_NOT_CONFIGURED");
        }
        const baseReference = data.reference ?? `INTENT_${Date.now()}`;
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            // Convert amount to cents for Stripe
            const amountInCents = Math.round(data.amount * 100);
            // Map currency to Stripe format (lowercase)
            const stripeCurrency = data.currency.toLowerCase();
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: stripeCurrency,
                metadata: {
                    reference: baseReference,
                    ...data.metadata,
                },
            });
            return {
                provider: data.provider,
                amount: data.amount,
                currency: data.currency,
                reference: baseReference,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        }
        if (data.provider === "CRYPTO") {
            return {
                provider: data.provider,
                amount: data.amount,
                currency: data.currency,
                reference: baseReference,
                status: "created",
                walletAddress: config_1.config.cryptoWalletAddress,
                instructions: data.metadata?.instructions ?? "Send funds to the provided wallet address",
            };
        }
        return {
            provider: data.provider,
            amount: data.amount,
            currency: data.currency,
            reference: baseReference,
            status: "created",
        };
    },
    getPaymentStatus: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            const paymentIntent = await stripe.paymentIntents.retrieve(data.paymentIntentId);
            return {
                provider: data.provider,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100, // Convert from cents to dollars
                amountCaptured: paymentIntent.amount_capturable / 100,
                amountDetails: paymentIntent.amount_details,
                clientSecret: paymentIntent.client_secret,
                lastPaymentError: paymentIntent.last_payment_error?.message,
            };
        }
        throw ApiError_1.ApiError.badRequest(`Payment status retrieval not supported for ${data.provider}`);
    },
    confirmPayment: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            if (!data.paymentMethodId) {
                throw ApiError_1.ApiError.badRequest("paymentMethodId is required for Stripe confirmation");
            }
            const paymentIntent = await stripe.paymentIntents.confirm(data.paymentIntentId, {
                payment_method: data.paymentMethodId,
            });
            return {
                provider: data.provider,
                status: paymentIntent.status,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
            };
        }
        throw ApiError_1.ApiError.badRequest(`Payment confirmation not supported for ${data.provider}`);
    },
    createPaymentMethod: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            if (!data.cardDetails) {
                throw ApiError_1.ApiError.badRequest("Card details are required");
            }
            const paymentMethod = await stripe.paymentMethods.create({
                type: "card",
                card: {
                    number: data.cardDetails.cardNumber,
                    exp_month: data.cardDetails.expMonth,
                    exp_year: data.cardDetails.expYear,
                    cvc: data.cardDetails.cvc,
                },
            });
            return {
                provider: data.provider,
                paymentMethodId: paymentMethod.id,
                last4: paymentMethod.card?.last4,
                brand: paymentMethod.card?.brand,
            };
        }
        throw ApiError_1.ApiError.badRequest(`Payment method creation not supported for ${data.provider}`);
    },
    refund: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            const refund = await stripe.refunds.create({
                payment_intent: data.paymentIntentId,
                amount: data.amount ? Math.round(data.amount * 100) : undefined, // Convert to cents if provided
            });
            return {
                provider: data.provider,
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount / 100, // Convert from cents
            };
        }
        throw ApiError_1.ApiError.badRequest(`Refund not supported for ${data.provider}`);
    },
    listPaymentMethods: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            const paymentMethods = await stripe.paymentMethods.list({
                customer: data.customerId,
            });
            return {
                provider: data.provider,
                paymentMethods: paymentMethods.data.map((pm) => ({
                    id: pm.id,
                    type: pm.type,
                    last4: pm.card?.last4,
                    brand: pm.card?.brand,
                    expMonth: pm.card?.exp_month,
                    expYear: pm.card?.exp_year,
                })),
            };
        }
        throw ApiError_1.ApiError.badRequest(`List payment methods not supported for ${data.provider}`);
    },
    deletePaymentMethod: async (data) => {
        if (data.provider === "STRIPE") {
            const stripe = getStripeClient();
            await stripe.paymentMethods.detach(data.paymentMethodId);
            return {
                provider: data.provider,
                success: true,
            };
        }
        throw ApiError_1.ApiError.badRequest(`Delete payment method not supported for ${data.provider}`);
    },
};
//# sourceMappingURL=payment-gateway.js.map