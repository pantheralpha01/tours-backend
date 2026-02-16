import { z } from "zod";
export declare const sendWhatsappSchema: z.ZodObject<{
    to: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    to: string;
}, {
    message: string;
    to: string;
}>;
export declare const respondWebhookSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
export declare const airtableSyncSchema: z.ZodObject<{
    action: z.ZodEnum<["pull", "push"]>;
    table: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "push" | "pull";
    table?: string | undefined;
}, {
    action: "push" | "pull";
    table?: string | undefined;
}>;
export declare const paymentIntentSchema: z.ZodObject<{
    provider: z.ZodEnum<["MPESA", "PAYPAL", "VISA", "MASTERCARD", "STRIPE"]>;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
    currency?: "USD" | "KES" | undefined;
    reference?: string | undefined;
}, {
    amount: number;
    provider: "MPESA" | "STRIPE" | "PAYPAL" | "VISA" | "MASTERCARD";
    currency?: "USD" | "KES" | undefined;
    reference?: string | undefined;
}>;
//# sourceMappingURL=integration.validation.d.ts.map