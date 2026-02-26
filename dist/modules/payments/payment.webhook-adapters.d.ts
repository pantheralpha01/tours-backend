import { ExternalPaymentProvider } from "../../integrations/payment-gateway";
export type NormalizedWebhookPayload = {
    reference: string;
    status: string;
    amount?: number;
    currency?: "USD" | "KES";
    eventType?: string;
    metadata?: Record<string, unknown>;
    eventId?: string;
    reason?: string;
};
type AdapterInput = {
    provider: ExternalPaymentProvider;
    payload: unknown;
};
export declare const normalizeWebhookPayload: (input: AdapterInput) => NormalizedWebhookPayload;
export {};
//# sourceMappingURL=payment.webhook-adapters.d.ts.map