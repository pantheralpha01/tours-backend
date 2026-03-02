import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

let stripeClient: Stripe | null = null;

const getStripeClient = (): Stripe => {
  if (!stripeClient) {
    if (!config.stripeSecretKey) {
      throw new Error("Stripe secret key is not configured");
    }
    stripeClient = new Stripe(config.stripeSecretKey);
  }
  return stripeClient;
};

const constructWebhookEvent = (
  body: string | Buffer,
  signature: string
): Stripe.Event => {
  const stripe = getStripeClient();

  if (!config.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    config.stripeWebhookSecret
  );
};

// @ts-expect-error - Kept for potential future webhook processing enhancements
const mapStripeStatusToPaymentState = (
  stripeStatus: string
): "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" => {
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

export const stripeWebhookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      throw new ApiError(400, "INVALID_REQUEST", "Missing stripe-signature header");
    }

    if (typeof signature !== "string") {
      throw new ApiError(400, "INVALID_REQUEST", "Invalid stripe-signature header");
    }

    const event = constructWebhookEvent(req.body, signature);

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Extract booking ID from metadata
        const bookingId = paymentIntent.metadata?.bookingId ||
          paymentIntent.metadata?.reference;

        if (bookingId) {
          console.log(
            `[Stripe Webhook] Payment succeeded for booking: ${bookingId}`
          );

          // Update payment status in database
          // You may want to call paymentService to update the payment record
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId ||
          paymentIntent.metadata?.reference;

        if (bookingId) {
          console.log(
            `[Stripe Webhook] Payment failed for booking: ${bookingId}`
          );
          console.log(
            `[Stripe Webhook] Failure reason: ${paymentIntent.last_payment_error?.message}`
          );
        }
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId ||
          paymentIntent.metadata?.reference;

        if (bookingId) {
          console.log(
            `[Stripe Webhook] Payment cancelled for booking: ${bookingId}`
          );
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[Stripe Webhook] Charge refunded: ${charge.id}`);
        // Handle refund logic
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`[Stripe Webhook] Dispute created: ${dispute.id}`);
        // Handle dispute logic
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, event: event.type });
  } catch (error) {
    if (error instanceof ApiError) {
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
        message:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
    });
  }
};
