import { z } from "zod";
export declare const createRefundSchema: z.ZodObject<{
    bookingId: z.ZodString;
    paymentId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    reason: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    reason: string;
    paymentId: string;
    currency?: "USD" | "KES" | undefined;
    reference?: string | undefined;
}, {
    amount: number;
    bookingId: string;
    reason: string;
    paymentId: string;
    currency?: "USD" | "KES" | undefined;
    reference?: string | undefined;
}>;
export declare const updateRefundSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["REQUESTED", "APPROVED", "DECLINED", "PROCESSING", "COMPLETED", "FAILED"]>>;
    reference: z.ZodOptional<z.ZodString>;
    processedAt: z.ZodOptional<z.ZodDate>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "APPROVED" | "COMPLETED" | "FAILED" | "REQUESTED" | "DECLINED" | "PROCESSING" | undefined;
    reference?: string | undefined;
    processedAt?: Date | undefined;
    transitionReason?: string | undefined;
}, {
    status?: "APPROVED" | "COMPLETED" | "FAILED" | "REQUESTED" | "DECLINED" | "PROCESSING" | undefined;
    reference?: string | undefined;
    processedAt?: Date | undefined;
    transitionReason?: string | undefined;
}>;
export declare const listRefundSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    bookingId: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: string | undefined;
    status?: string | undefined;
    bookingId?: string | undefined;
    paymentId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    sort?: string | undefined;
    limit?: number | undefined;
    status?: string | undefined;
    bookingId?: string | undefined;
    paymentId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const refundIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=refund.validation.d.ts.map