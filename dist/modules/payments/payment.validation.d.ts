import { z } from "zod";
export declare const paymentProviderEnum: z.ZodEnum<["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO"]>;
export declare const manualProviderEnum: z.ZodEnum<["CASH", "BANK_TRANSFER", "MPESA", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO", "OTHER"]>;
export declare const createPaymentSchema: z.ZodObject<{
    provider: z.ZodEnum<["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO"]>;
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
}, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
}>;
export declare const initiatePaymentSchema: z.ZodObject<{
    provider: z.ZodEnum<["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO"]>;
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
}, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
}>;
export declare const manualPaymentSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodOptional<z.ZodEnum<["CASH", "BANK_TRANSFER", "MPESA", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO", "OTHER"]>>>;
    notes: z.ZodOptional<z.ZodString>;
    recordedAt: z.ZodOptional<z.ZodDate>;
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "CRYPTO" | "CASH" | "BANK_TRANSFER" | "OTHER";
    currency?: "USD" | "KES" | undefined;
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
    recordedAt?: Date | undefined;
}, {
    amount: number;
    bookingId: string;
    currency?: "USD" | "KES" | undefined;
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    provider?: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "CRYPTO" | "CASH" | "BANK_TRANSFER" | "OTHER" | undefined;
    reference?: string | undefined;
    recordedAt?: Date | undefined;
}>;
export declare const updatePaymentSchema: z.ZodObject<{
    state: z.ZodOptional<z.ZodEnum<["INITIATED", "PENDING", "COMPLETED", "FAILED", "CANCELLED"]>>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    metadata?: Record<string, any> | undefined;
    state?: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED" | undefined;
    reference?: string | undefined;
    transitionReason?: string | undefined;
}, {
    metadata?: Record<string, any> | undefined;
    state?: "CANCELLED" | "PENDING" | "COMPLETED" | "INITIATED" | "FAILED" | undefined;
    reference?: string | undefined;
    transitionReason?: string | undefined;
}>;
export declare const paymentIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const webhookProviderParamSchema: z.ZodObject<{
    provider: z.ZodEnum<["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD", "CRYPTO"]>;
}, "strip", z.ZodTypeAny, {
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
}, {
    provider: "MPESA" | "PAYPAL" | "VISA" | "MASTERCARD" | "STRIPE" | "CRYPTO";
}>;
export declare const paymentWebhookSchema: z.ZodObject<{
    reference: z.ZodString;
    status: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    eventType: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    eventId: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    reference: string;
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    reason?: string | undefined;
    metadata?: Record<string, any> | undefined;
    eventType?: string | undefined;
    eventId?: string | undefined;
}, {
    status: string;
    reference: string;
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    reason?: string | undefined;
    metadata?: Record<string, any> | undefined;
    eventType?: string | undefined;
    eventId?: string | undefined;
}>;
//# sourceMappingURL=payment.validation.d.ts.map