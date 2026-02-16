import { z } from "zod";
export declare const createPaymentSchema: z.ZodObject<{
    bookingId: z.ZodString;
    provider: z.ZodEnum<["MPESA", "STRIPE", "PAYPAL", "VISA", "MASTERCARD"]>;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
}, {
    amount: number;
    bookingId: string;
    provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
    currency?: "USD" | "KES" | undefined;
    metadata?: Record<string, any> | undefined;
    reference?: string | undefined;
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
//# sourceMappingURL=payment.validation.d.ts.map