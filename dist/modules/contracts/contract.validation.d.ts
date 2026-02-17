import { z } from "zod";
export declare const createContractSchema: z.ZodObject<{
    bookingId: z.ZodString;
    partnerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SENT", "SIGNED", "CANCELLED"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    signedAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SIGNED" | undefined;
    metadata?: Record<string, any> | undefined;
    partnerId?: string | undefined;
    fileUrl?: string | undefined;
    signedAt?: Date | undefined;
}, {
    bookingId: string;
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SIGNED" | undefined;
    metadata?: Record<string, any> | undefined;
    partnerId?: string | undefined;
    fileUrl?: string | undefined;
    signedAt?: Date | undefined;
}>;
export declare const updateContractSchema: z.ZodObject<{
    partnerId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SENT", "SIGNED", "CANCELLED"]>>;
    fileUrl: z.ZodOptional<z.ZodString>;
    signedAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SIGNED" | undefined;
    metadata?: Record<string, any> | undefined;
    partnerId?: string | undefined;
    fileUrl?: string | undefined;
    signedAt?: Date | undefined;
}, {
    status?: "DRAFT" | "CANCELLED" | "SENT" | "SIGNED" | undefined;
    metadata?: Record<string, any> | undefined;
    partnerId?: string | undefined;
    fileUrl?: string | undefined;
    signedAt?: Date | undefined;
}>;
export declare const listContractSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    bookingId: z.ZodOptional<z.ZodString>;
    partnerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    bookingId?: string | undefined;
    partnerId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    bookingId?: string | undefined;
    partnerId?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const contractIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=contract.validation.d.ts.map