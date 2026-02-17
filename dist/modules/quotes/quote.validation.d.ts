import { z } from "zod";
export declare const createQuoteSchema: z.ZodObject<{
    bookingId: z.ZodString;
    title: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    items: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    notes: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    title: string;
    currency?: "USD" | "KES" | undefined;
    agentId?: string | undefined;
    expiresAt?: Date | undefined;
    items?: Record<string, any> | undefined;
    notes?: string | undefined;
}, {
    amount: number;
    bookingId: string;
    title: string;
    currency?: "USD" | "KES" | undefined;
    agentId?: string | undefined;
    expiresAt?: Date | undefined;
    items?: Record<string, any> | undefined;
    notes?: string | undefined;
}>;
export declare const updateQuoteSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"]>>;
    amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    items: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | undefined;
    title?: string | undefined;
    expiresAt?: Date | undefined;
    items?: Record<string, any> | undefined;
    notes?: string | undefined;
}, {
    amount?: number | undefined;
    currency?: "USD" | "KES" | undefined;
    status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | undefined;
    title?: string | undefined;
    expiresAt?: Date | undefined;
    items?: Record<string, any> | undefined;
    notes?: string | undefined;
}>;
export declare const listQuoteSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    bookingId: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    agentId?: string | undefined;
    bookingId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const quoteIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=quote.validation.d.ts.map