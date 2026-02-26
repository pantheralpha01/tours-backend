import { z } from "zod";
export declare const createPartnerInviteSchema: z.ZodObject<{
    companyName: z.ZodString;
    email: z.ZodString;
    expiresInDays: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    companyName: string;
    notes?: string | undefined;
    expiresInDays?: number | undefined;
}, {
    email: string;
    companyName: string;
    notes?: string | undefined;
    expiresInDays?: number | undefined;
}>;
export declare const listPartnerInviteSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ACCEPTED", "EXPIRED"]>>;
    invitedById: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    search?: string | undefined;
    status?: "ACCEPTED" | "EXPIRED" | "PENDING" | undefined;
    invitedById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    search?: string | undefined;
    status?: "ACCEPTED" | "EXPIRED" | "PENDING" | undefined;
    invitedById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const acceptPartnerInviteSchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    contactName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contactName: string;
    notes?: string | undefined;
    phone?: string | undefined;
    companyName?: string | undefined;
}, {
    contactName: string;
    notes?: string | undefined;
    phone?: string | undefined;
    companyName?: string | undefined;
}>;
//# sourceMappingURL=partner-invite.validation.d.ts.map