import { z } from "zod";
export declare const createReceiptSchema: z.ZodObject<{
    bookingId: z.ZodString;
    paymentId: z.ZodString;
    receiptNumber: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodEnum<["USD", "KES"]>>;
    status: z.ZodOptional<z.ZodEnum<["ISSUED", "VOID"]>>;
    issuedAt: z.ZodOptional<z.ZodDate>;
    fileUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    bookingId: string;
    paymentId: string;
    receiptNumber: string;
    currency?: "USD" | "KES" | undefined;
    status?: "ISSUED" | "VOID" | undefined;
    fileUrl?: string | undefined;
    issuedAt?: Date | undefined;
}, {
    amount: number;
    bookingId: string;
    paymentId: string;
    receiptNumber: string;
    currency?: "USD" | "KES" | undefined;
    status?: "ISSUED" | "VOID" | undefined;
    fileUrl?: string | undefined;
    issuedAt?: Date | undefined;
}>;
export declare const updateReceiptSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["ISSUED", "VOID"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "ISSUED" | "VOID" | undefined;
    fileUrl?: string | undefined;
}, {
    status?: "ISSUED" | "VOID" | undefined;
    fileUrl?: string | undefined;
}>;
export declare const listReceiptSchema: z.ZodObject<{
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
export declare const receiptIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=receipt.validation.d.ts.map