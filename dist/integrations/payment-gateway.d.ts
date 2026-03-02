import Stripe from "stripe";
export type ExternalPaymentProvider = "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
export declare const paymentGatewayService: {
    createIntent: (data: {
        provider: ExternalPaymentProvider;
        amount: number;
        currency: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{
        provider: "STRIPE";
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: Stripe.PaymentIntent.Status;
        clientSecret: string | null;
        paymentIntentId: string;
        walletAddress?: undefined;
        instructions?: undefined;
    } | {
        provider: "CRYPTO";
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: string;
        walletAddress: string;
        instructions: {};
        clientSecret?: undefined;
        paymentIntentId?: undefined;
    } | {
        provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD";
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: string;
        clientSecret?: undefined;
        paymentIntentId?: undefined;
        walletAddress?: undefined;
        instructions?: undefined;
    }>;
    getPaymentStatus: (data: {
        provider: ExternalPaymentProvider;
        paymentIntentId: string;
    }) => Promise<{
        provider: "STRIPE";
        status: Stripe.PaymentIntent.Status;
        amount: number;
        amountCaptured: number;
        amountDetails: Stripe.PaymentIntent.AmountDetails | undefined;
        clientSecret: string | null;
        lastPaymentError: string | undefined;
    }>;
    confirmPayment: (data: {
        provider: ExternalPaymentProvider;
        paymentIntentId: string;
        paymentMethodId?: string;
    }) => Promise<{
        provider: "STRIPE";
        status: Stripe.PaymentIntent.Status;
        paymentIntentId: string;
        clientSecret: string | null;
    }>;
    createPaymentMethod: (data: {
        provider: ExternalPaymentProvider;
        type: "card" | "bank_account";
        cardDetails?: {
            cardNumber: string;
            expMonth: number;
            expYear: number;
            cvc: string;
        };
    }) => Promise<{
        provider: "STRIPE";
        paymentMethodId: string;
        last4: string | undefined;
        brand: string | undefined;
    }>;
    refund: (data: {
        provider: ExternalPaymentProvider;
        paymentIntentId: string;
        amount?: number;
    }) => Promise<{
        provider: "STRIPE";
        refundId: string;
        status: string | null;
        amount: number;
    }>;
    listPaymentMethods: (data: {
        provider: ExternalPaymentProvider;
        customerId: string;
    }) => Promise<{
        provider: "STRIPE";
        paymentMethods: {
            id: string;
            type: Stripe.PaymentMethod.Type;
            last4: string | undefined;
            brand: string | undefined;
            expMonth: number | undefined;
            expYear: number | undefined;
        }[];
    }>;
    deletePaymentMethod: (data: {
        provider: ExternalPaymentProvider;
        paymentMethodId: string;
    }) => Promise<{
        provider: "STRIPE";
        success: boolean;
    }>;
};
//# sourceMappingURL=payment-gateway.d.ts.map