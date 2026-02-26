export type ExternalPaymentProvider = "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
export declare const paymentGatewayService: {
    createIntent: (data: {
        provider: ExternalPaymentProvider;
        amount: number;
        currency: "USD" | "KES";
        reference?: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{
        provider: "CRYPTO";
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: string;
        walletAddress: string;
        instructions: {};
    } | {
        provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE";
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: string;
        walletAddress?: undefined;
        instructions?: undefined;
    }>;
};
//# sourceMappingURL=payment-gateway.d.ts.map