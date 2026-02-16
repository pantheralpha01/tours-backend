import { z } from "zod";
export declare const createDisputeSchema: z.ZodObject<{
    bookingId: z.ZodString;
    reason: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    assignedToId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    reason: string;
    description?: string | undefined;
    assignedToId?: string | undefined;
}, {
    bookingId: string;
    reason: string;
    description?: string | undefined;
    assignedToId?: string | undefined;
}>;
export declare const updateDisputeSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]>>;
    reason: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    assignedToId: z.ZodOptional<z.ZodString>;
    resolvedAt: z.ZodOptional<z.ZodDate>;
    transitionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "REJECTED" | "OPEN" | "UNDER_REVIEW" | "RESOLVED" | undefined;
    reason?: string | undefined;
    description?: string | undefined;
    assignedToId?: string | undefined;
    resolvedAt?: Date | undefined;
    transitionReason?: string | undefined;
}, {
    status?: "REJECTED" | "OPEN" | "UNDER_REVIEW" | "RESOLVED" | undefined;
    reason?: string | undefined;
    description?: string | undefined;
    assignedToId?: string | undefined;
    resolvedAt?: Date | undefined;
    transitionReason?: string | undefined;
}>;
export declare const listDisputeSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    dateFrom: z.ZodOptional<z.ZodDate>;
    dateTo: z.ZodOptional<z.ZodDate>;
} & {
    bookingId: z.ZodOptional<z.ZodString>;
    openedById: z.ZodOptional<z.ZodString>;
    assignedToId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort?: string | undefined;
    status?: string | undefined;
    bookingId?: string | undefined;
    openedById?: string | undefined;
    assignedToId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
}, {
    sort?: string | undefined;
    limit?: number | undefined;
    status?: string | undefined;
    bookingId?: string | undefined;
    openedById?: string | undefined;
    assignedToId?: string | undefined;
    dateFrom?: Date | undefined;
    dateTo?: Date | undefined;
    page?: number | undefined;
}>;
export declare const disputeIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=dispute.validation.d.ts.map