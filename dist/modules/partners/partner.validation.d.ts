import { z } from "zod";
export declare const createPartnerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | undefined;
    isActive?: boolean | undefined;
    phone?: string | undefined;
}, {
    name: string;
    email?: string | undefined;
    isActive?: boolean | undefined;
    phone?: string | undefined;
}>;
export declare const updatePartnerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    approvalStatus: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED"]>>;
    rejectedReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    isActive?: boolean | undefined;
    phone?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    rejectedReason?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    isActive?: boolean | undefined;
    phone?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    rejectedReason?: string | undefined;
}>;
export declare const listPartnerSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    approvalStatus: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED"]>>;
    createdById: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    createdById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    limit?: number | undefined;
    status?: string | undefined;
    approvalStatus?: "REJECTED" | "PENDING" | "APPROVED" | undefined;
    createdById?: string | undefined;
    sort?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const partnerIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const rejectPartnerSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
//# sourceMappingURL=partner.validation.d.ts.map