export type ExternalPaymentProvider = "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE";
export declare const paymentGatewayService: {
    createIntent: (data: {
        provider: ExternalPaymentProvider;
        amount: number;
        currency: "USD" | "KES";
        reference?: string;
    }) => Promise<{
        provider: ExternalPaymentProvider;
        amount: number;
        currency: "USD" | "KES";
        reference: string;
        status: string;
    }>;
};
//# sourceMappingURL=payment-gateway.d.ts.map