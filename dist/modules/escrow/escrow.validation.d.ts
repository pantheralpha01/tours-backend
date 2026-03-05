import { z } from "zod";
export declare const escrowReleaseSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["USD", "KES"]>>;
    notes: z.ZodOptional<z.ZodString>;
    releaseAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: "USD" | "KES";
    notes?: string | undefined;
    releaseAt?: Date | undefined;
}, {
    amount: number;
    notes?: string | undefined;
    currency?: "USD" | "KES" | undefined;
    releaseAt?: Date | undefined;
}>;
export declare const bookingParamSchema: z.ZodObject<{
    bookingId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
}, {
    bookingId: string;
}>;
export declare const payoutParamSchema: z.ZodObject<{
    bookingId: z.ZodString;
    payoutId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    payoutId: string;
}, {
    bookingId: string;
    payoutId: string;
}>;
export declare const payoutStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["APPROVED", "SENT", "CANCELLED"]>;
    transactionReference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status: "CANCELLED" | "SENT" | "APPROVED";
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    transactionReference?: string | undefined;
}, {
    status: "CANCELLED" | "SENT" | "APPROVED";
    notes?: string | undefined;
    metadata?: Record<string, any> | undefined;
    transactionReference?: string | undefined;
}>;
//# sourceMappingURL=escrow.validation.d.ts.map