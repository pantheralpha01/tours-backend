import { config } from "../config";
import { ApiError } from "../utils/ApiError";
import Stripe from "stripe";

export type ExternalPaymentProvider =
  | "MPESA"
  | "PAYPAL"
  | "VISA"
  | "MASTERCARD"
  | "STRIPE"
  | "CRYPTO";

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

const providerConfigured = (provider: ExternalPaymentProvider) => {
  if (provider === "PAYPAL") {
    return Boolean(config.paypalClientId && config.paypalClientSecret);
  }
  if (provider === "MPESA") {
    return Boolean(
      config.mpesaConsumerKey &&
        config.mpesaConsumerSecret &&
        config.mpesaShortCode &&
        config.mpesaPasskey &&
        config.mpesaCallbackUrl
    );
  }
  if (provider === "VISA" || provider === "MASTERCARD") {
    return Boolean(config.cardGatewayKey);
  }
  if (provider === "STRIPE") {
    return Boolean(config.stripeSecretKey && config.stripePublishableKey);
  }
  if (provider === "CRYPTO") {
    return Boolean(config.cryptoWalletAddress);
  }
  return false;
};

export const paymentGatewayService = {
  createIntent: async (data: {
    provider: ExternalPaymentProvider;
    amount: number;
    currency: "USD" | "KES";
    reference?: string;
    metadata?: Record<string, unknown>;
  }) => {
    if (!providerConfigured(data.provider)) {
      throw ApiError.badRequest(
        `${data.provider} gateway is not configured`,
        "PAYMENT_GATEWAY_NOT_CONFIGURED"
      );
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
        walletAddress: config.cryptoWalletAddress,
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

  getPaymentStatus: async (data: {
    provider: ExternalPaymentProvider;
    paymentIntentId: string;
  }) => {
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

    throw ApiError.badRequest(`Payment status retrieval not supported for ${data.provider}`);
  },

  confirmPayment: async (data: {
    provider: ExternalPaymentProvider;
    paymentIntentId: string;
    paymentMethodId?: string;
  }) => {
    if (data.provider === "STRIPE") {
      const stripe = getStripeClient();
      
      if (!data.paymentMethodId) {
        throw ApiError.badRequest("paymentMethodId is required for Stripe confirmation");
      }

      const paymentIntent = await stripe.paymentIntents.confirm(
        data.paymentIntentId,
        {
          payment_method: data.paymentMethodId,
        }
      );

      return {
        provider: data.provider,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    }

    throw ApiError.badRequest(`Payment confirmation not supported for ${data.provider}`);
  },

  createPaymentMethod: async (data: {
    provider: ExternalPaymentProvider;
    type: "card" | "bank_account";
    cardDetails?: {
      cardNumber: string;
      expMonth: number;
      expYear: number;
      cvc: string;
    };
  }) => {
    if (data.provider === "STRIPE") {
      const stripe = getStripeClient();

      if (!data.cardDetails) {
        throw ApiError.badRequest("Card details are required");
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

    throw ApiError.badRequest(`Payment method creation not supported for ${data.provider}`);
  },

  refund: async (data: {
    provider: ExternalPaymentProvider;
    paymentIntentId: string;
    amount?: number;
  }) => {
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

    throw ApiError.badRequest(`Refund not supported for ${data.provider}`);
  },

  listPaymentMethods: async (data: {
    provider: ExternalPaymentProvider;
    customerId: string;
  }) => {
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

    throw ApiError.badRequest(`List payment methods not supported for ${data.provider}`);
  },

  deletePaymentMethod: async (data: {
    provider: ExternalPaymentProvider;
    paymentMethodId: string;
  }) => {
    if (data.provider === "STRIPE") {
      const stripe = getStripeClient();

      await stripe.paymentMethods.detach(data.paymentMethodId);

      return {
        provider: data.provider,
        success: true,
      };
    }

    throw ApiError.badRequest(`Delete payment method not supported for ${data.provider}`);
  },
};

