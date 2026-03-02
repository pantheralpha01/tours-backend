"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
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
const constructWebhookEvent = (body, signature) => {
    const stripe = getStripeClient();
    if (!config_1.config.stripeWebhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    return stripe.webhooks.constructEvent(body, signature, config_1.config.stripeWebhookSecret);
};
// @ts-expect-error - Kept for potential future webhook processing enhancements
const mapStripeStatusToPaymentState = (stripeStatus) => {
    switch (stripeStatus) {
        case "succeeded":
            return "COMPLETED";
        case "processing":
        case "requires_action":
        case "requires_capture":
            return "PENDING";
        case "requires_payment_method":
            return "INITIATED";
        case "canceled":
            return "CANCELLED";
        default:
            return "PENDING";
    }
};
const stripeWebhookHandler = async (req, res) => {
    try {
        const signature = req.headers["stripe-signature"];
        if (!signature) {
            throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Missing stripe-signature header");
        }
        if (typeof signature !== "string") {
            throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "Invalid stripe-signature header");
        }
        const event = constructWebhookEvent(req.body, signature);
        console.log(`[Stripe Webhook] Received event: ${event.type}`);
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                // Extract booking ID from metadata
                const bookingId = paymentIntent.metadata?.bookingId ||
                    paymentIntent.metadata?.reference;
                if (bookingId) {
                    console.log(`[Stripe Webhook] Payment succeeded for booking: ${bookingId}`);
                    // Update payment status in database
                    // You may want to call paymentService to update the payment record
                }
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata?.bookingId ||
                    paymentIntent.metadata?.reference;
                if (bookingId) {
                    console.log(`[Stripe Webhook] Payment failed for booking: ${bookingId}`);
                    console.log(`[Stripe Webhook] Failure reason: ${paymentIntent.last_payment_error?.message}`);
                }
                break;
            }
            case "payment_intent.canceled": {
                const paymentIntent = event.data.object;
                const bookingId = paymentIntent.metadata?.bookingId ||
                    paymentIntent.metadata?.reference;
                if (bookingId) {
                    console.log(`[Stripe Webhook] Payment cancelled for booking: ${bookingId}`);
                }
                break;
            }
            case "charge.refunded": {
                const charge = event.data.object;
                console.log(`[Stripe Webhook] Charge refunded: ${charge.id}`);
                // Handle refund logic
                break;
            }
            case "charge.dispute.created": {
                const dispute = event.data.object;
                console.log(`[Stripe Webhook] Dispute created: ${dispute.id}`);
                // Handle dispute logic
                break;
            }
            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
        res.json({ received: true, event: event.type });
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError) {
            res.status(error.statusCode).json({
                success: false,
                error: {
                    code: error.code,
                    message: error.message,
                },
            });
            return;
        }
        console.error("[Stripe Webhook Error]", error);
        res.status(400).json({
            success: false,
            error: {
                code: "WEBHOOK_ERROR",
                message: error instanceof Error ? error.message : "Webhook processing failed",
            },
        });
    }
};
exports.stripeWebhookHandler = stripeWebhookHandler;
//# sourceMappingURL=stripe-webhook.js.map