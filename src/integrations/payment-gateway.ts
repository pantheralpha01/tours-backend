import { config } from "../config";
import { ApiError } from "../utils/ApiError";

export type ExternalPaymentProvider =
  | "MPESA"
  | "PAYPAL"
  | "VISA"
  | "MASTERCARD"
  | "STRIPE"
  | "CRYPTO";

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
    return Boolean(config.stripeSecretKey);
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
};
